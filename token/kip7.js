// caver-js-ext-kas 모듈 로드
// : 클레이튼에 있는 컨트랙트 가져오기
const CaverExtKAS = require('caver-js-ext-kas')
// class 생성
const caver = new CaverExtKAS()
// fs 모듈 로드
// 토큰의 주소를 만들었을 때 파일로 관리하기 위해..?
const fs = require('fs')
// dotenv 로드 (환경변수 설정)
require('dotenv').config()

// KAS에 접속하기 위한 ID, PASSWORD 파일을 로드 
const kas_info = require('./kas.json')
console.log("-> kas_info: ", kas_info)

// accesskeyID 변수, secretAccessKey 생성
const accesskeyID = kas_info.accessKeyId
const secretAccessKey = kas_info.secretAccessKey
// testnet의 chainid 지정
const chainid = 1001

// 생성자 함수 호출 
caver.initKASAPI(chainid, accesskeyID, secretAccessKey)

// KAS에서 외부 지갑을 사용하기 위해서는 지갑을 등록해주어야 한다.
const keyringContainer = new caver.keyringContainer()
// 연결할 지갑 주소 + 프라이빗 키
const keyring = keyringContainer.keyring.createFromPrivateKey(process.env.private_key)
console.log("-> 이것은 키링입니다: ", keyring)
keyringContainer.add(keyring)
console.log("->이것은 컨테이너: ", keyringContainer)

// 토큰 생성 함수 (이름, 심볼, 소수점, 만들 양)
async function create_token(_name, _symbol, _decimal, _amount) {
    // kas에서 만든 kip7 배포
    const kip7 = await caver.kct.kip7.deploy(
        {
            name : _name,
            symbol : _symbol,
            decimals : _decimal,
            initialSupply : _amount
        },
        // 수수료 낼 지갑 주소
        keyring.address, // 발행자
        keyringContainer
    )

    const addr = kip7._address
    console.log("-> addr: ", addr)

    // 주소값 일일이 복사해서 쓰기 귀찮음 
    // 토큰의 주소값을 json 파일 안에 대입
    const kip7_address = {
        address : addr
    }
    //json을 문자열로 변환
    const data = JSON.stringify(kip7_address)
    //json 파일의 형태로 저장 (이름, 데이터)
    fs.writeFileSync('./token/kip7.json', data) // 경로!!

    return '토큰 발행 완료'
}

// 함수 호출
create_token('test', 'TST', 0, 1000000)

// 토큰을 거래하는 함수 선언 
async function transfer(_address, _amount) {
    // 발행한 토큰을 지갑에 추가
    const token_info = require('./kip7.json')
    const kip7 = await new caver.kct.kip7(token_info.address)
    kip7.setWallet(keyringContainer)

    const receipt = await kip7.transfer(
        _address,
        _amount, 
        {
            from : keyring.address
        }
    )

    console.log("-> receipt: ", receipt)
    return '토큰 거래 완료'
}

// 새로 생성한 지갑 주소 넣기
// transfer('0x739563DD6d5a8C0419775F83A8066B347C2da97b', 80)

// 유저가 토큰 발행자에게 토큰을 보내주는 함수 (transaction의 주체자가 발행자)
// 잘 안 씀..
async function transfer_from(_private, _amount) {
     // 발행한 토큰을 지갑에 추가
     const token_info = require('./kip7.json')
     const kip7 = await new caver.kct.kip7(token_info.address)
     kip7.setWallet(keyringContainer)
 
     // 토큰 발행자의 지갑 주소
     const owner = keyring.address
     console.log("-> owner: ", owner)
 
     // 유저의 지갑 주소를 keyringContainerd에 등록
     const keyring2 = keyringContainer.keyring.createFromPrivateKey(
         _private
     )

     keyringContainer.add(keyring2)

     // 내 지갑에 있는 일정 토큰을 다른 사람이 이동 시킬 수 있도록 권한 부여
     // approve(권한을 받을 지갑의 주소, 토큰의 양, from)
     await kip7.approve(owner, _amount,{
            from : keyring2.address
        })

     const receipt = await kip7.transferFrom(
        keyring2.address,
        owner,
        _amount,
        {
            from : owner
        }
     )

     console.log('-> receipt: ', receipt)
     return "토큰 이동 완료"
}

// 두번째 지갑 프라이빗키 
//transfer_from('0x289eff0c891aa43a6fbc046f35cc374264e8f33c2ff614888e02b47482d92570', 10)

// 토큰 양 확인
async function balance_of(_address) {
    const token_info = require('./kip7.json')
    const kip7 = await new caver.kct.kip7(token_info.address)
    kip7.setWallet(keyringContainer)
 
    const balance = await kip7.balanceOf(_address)

    console.log("-> balance: ", balance)
    return balance
}

// 지갑을 생성해주는 함수
async function create_wallet(){
    const wallet = await caver.kas.wallet.createAccount()
    console.log("-> 생성된 지갑: ", wallet)
    return wallet.address // 지갑에 있는 주소 리턴
}

// 외부에서 함수 호출 할 수 있도록 하기
module.exports = {
    create_token, transfer, transfer_from, balance_of, create_wallet
}