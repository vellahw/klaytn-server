const express = require('express')
const router = express.Router()

// DB에 저장하기 위한 Mysql 로드
const mysql = require('mysql2')

const connection = mysql.createConnection(
    {
        host : process.env.host,
        port : process.env.port,
        user : process.env.user,
        password: process.env.password,
        database: process.env.database
    }
)

// kip7.js 로드
const token = require('../token/kip7.js')

module.exports = ()=>{
    // 기본 경로 localhost:3000/
    router.get('/', (req, res)=>
        res.render('login.ejs')
    )

    // 회원가입 페이지
    router.get('/signup', (req, res)=>
        res.render('signup.ejs')
    )

    // 유저가 입력한 정보를 mysql db에 삽입
    router.post('/signup', async (req, res)=>{
        // 유저가 입력한 정보를 변수에 대입, 확인
        const input_phone = req.body._phone
        const input_pass = req.body._pass
        console('-> 회원가입 정보: ', input_phone, input_pass)
        const wallet = await token.create_wallet()
        console.log('-> 지갑 생성 됐을까욤: ', wallet)
        
    })

}