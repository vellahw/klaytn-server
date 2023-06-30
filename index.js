// express 노드
const express = require('express')
const app = express()

// 포트 번호 설정
const port = 3000

// view 파일들의 기본 경로 설정
app.set('views', __dirname+'/views')
//view 엔진 설정
app.set('view engine', 'ejs')

//post 방식으로 들어오는 데이터를 json 형태로 변환
app.use(express.urlencoded({extended:false}))

//dotenv 설정
require('dotenv').config()

// express-session 모듈 로드
const session = require('express-session')
const sessionObj = {
    secret : process.env.secret, // 암호화 키값 
    resave : false,
    saveUninitialized: false,
    cookie : {
        maxAge : 60000 // 쿠키 수명 설정 - 1분 (1000당 1초)
    }
}

// session 설정
app.use(
    session(sessionObj)
)

// 메인 페이지 설정
const main = require('./routes/main.js')()
app.use('/', main)

// 모듈화 (라우팅)
const token = require('./routes/token.js')() // 빈괄호=함수 호출
app.use('/token', token) // /token: 주소

const server = app.listen(port, ()=>console.log(port, 'Server Start!!!'))