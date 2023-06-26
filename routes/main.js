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
    router.get('/', (req, res)=>{
        res.render('login.ejs')
    })
}