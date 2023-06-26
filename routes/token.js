// express 로드
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
        const input_decimal = req.query._decimal
        const input_amount = req.query._amount
        console.log("-> name, symbol, decimal, amount: ", input_name, input_symbol, input_decimal, input_amount)
    })

}