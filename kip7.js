// caver-js-ext-kas 모듈 로드
// : 클레이튼에 있는 컨트랙트 가져오기
const CaverExtKAS = require('caver-js-ext-kas')
// class 생성
const caver = new CaverExtKAS()
// fs 모듈 로드
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
const keyring = keyringContainer.keyring.createFromPrivateKey(process.env.private_key)

keyringContainer.add(keyring)

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
        keyring.address,
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
    fs.writeFileSync('kip7.json', data)

    return '토큰 발행 완료'
}

// 함수 호출
create_token('test', 'TST', 0, 1000000)
