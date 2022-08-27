const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')

app.use(cookieParser())
app.use(bodyParser.json())

const jwtKey = "abc123"; //토큰 암호화 키

const members = [
    {
        id: 3,
        name: "도서관",
        loginId: "lib",
        loginPW: "1234"
    },
    {
        id: 3,
        name: "홍길동",
        loginId: "a",
        loginPW: "1"
    }
]

app.get('/api/account', (req, res) => { //get 방식으로 값을 전달받으면
    if(req.cookies && req.cookies.token){ //쿠키 값이 있는지 체크
        jwt.verify(req.cookies.token, jwtKey, (err, decoded)=>{ //쿠키에 있는 토큰 값을 암호화 키로 검증해서 
            if(err) {
                return res.sendStatus(401); //에러가 있으면 401
            }
            res.send(decoded); //에러가 없으면 decoded된 값을 보냄
        })
    }
    else { 
        res.sendStatus(401);
    }
})

app.post('/api/account', (req, res) => { //사용자가 post로 값을 던지면
    const loginId = req.body.loginId; //body로 받아서 
    const loginPW = req.body.loginPW;

    const member = members.find(m=> m.loginId === loginId && m.loginPW === loginPW); //members라는 배열에서 찾다가
    if(member){ //값이 있으면
        const options = { //아래와 같은 옵션을 가진 쿠키로 저장
            domain: "localhost",
            path: "/",
            httpOnly: true
        };
        
        //jwt 모듈로 토큰 생성
        const token = jwt.sign({ //sign으로
            id: member.id, //id와 name을 가진 객체를 만듦
            name: member.name, //멤버에 대한 객체정보
        }, jwtKey, { //암호화 키
            expiresIn: "15m", //만료시간
            issuer: "author" //발급자
        });

        res.cookie("token", token, options); //위 내용을 token이라는 쿠키에 넣어줌
        res.send(member);
    }
    else {
        res.sendStatus(404);
    }
    console.log(loginId, loginPW);
  })

app.delete('/api/account', (req, res) => { //로그아웃 기능
    if(req.cookies && req.cookies.token) { //쿠키 값이 있으면 clear
        res.clearCookie("token");
    }
    res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})