// express 로드
const express = require('express')
const router = express.Router()

// token 폴더의 kip7.js 로드
const token = require('../token/kip7.js')

// 외부에서 함수로 바로 호출되게
module.exports = function(){
    // api 생성
    // token.js 파일의 기본 경로는 localhost:3000/token

    router.get('/', (req, res)=>{
        res.render('create_token.ejs')
    })

    // 토큰을 발행하는 api
    //localhost:3000/token/create [get]
    router.get('/create', async (req, res)=>{
        // 유저가 보낸 데이터를 변수에 대입, 확인
        const input_name = req.query._name
        const input_symbol = req.query._symbol
        const input_decimal = Number(req.query._decimal)
        const input_amount = Number(req.query._amount)
        console.log("-> name, symbol, decimal, amount: ", input_name, input_symbol, input_decimal, input_amount)
       
        // 토큰 발행 함수 실행
        const receipt = await token.create_token(
            input_name, input_symbol, input_decimal, input_amount
            )
        
        console.log("-> receipt: ", receipt)
        res.send(receipt)
    })

    // 로그인한 유저의 지갑에 토큰을 거래하는 api
    router.get('/charge', async (req, res)=>{
        if(!req.session.logined){
            res.redirect('/')
        }else{
            const input_amount = Number(req.query._amount)
            console.log('-> 입력한 Amount: ', input_amount)
            
            const wallet = req.session.logined.wallet
            console.log('-> 로그인한 유저 지갑 주소: ', wallet)
            
            // kip7.js에 있는 transfer() 호출 : 토큰을 거래하는 함수
            const receipt = await token.transfer(wallet, input_amount)
            console.log('-> 결과 확인: ', receipt)

            res.redirect('/')
        }
    })

    // 마이페이지
    router.get('/info', async (req, res)=>{
        // 로그인을 한 지갑의 토큰 양을 로드
        // kip7.js의 balance_of() 함수 호출
        if(!req.session.logined){
            res.redirect('/')
        } else {
            const wallet = req.session.logined.wallet
            console.log('-> 조회할 주소: ', wallet)
            const balance = await token.balance_of(wallet)
            console.log('-> 조회할 주소가 가진 토큰양: ', balance)
            res.render('info.ejs', {
                //유저의 phone, wallet, 토큰의 양
                'user' : req.session.logined,
                'balance' : balance
            })
        }
    })

    return router
}