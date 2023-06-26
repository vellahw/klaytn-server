// express 로드
// express 로드
const express = require('express')
const router = express.Router()

// token 폴더의 kip7.js 로드
const token = require('../token/kip7.js')

// 외부에서 함수로 바로 호출되게
module.exports = function(){
    // api 생성
    // token.js 파일의 기본 경로는 localhost:300/token

    router.get('/', (req, res)=>{
        res.render('create_token.ejs')
    })
}