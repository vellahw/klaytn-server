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


