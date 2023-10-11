const express = require('express');
const users = require('./users.json');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();
const port = 3000;
const SECRET = 'shhhh';
const DOMAIN_API = '127.0.0.1'

app.use(express.json()) // for parsing application/json
app.use(cookieParser()) //cookie-parser dùng để đọc cookies của request:
app.use(cors({
    origin: `http://${DOMAIN_API}:5500`, //Chan tat ca cac domain khac ngoai domain nay
    credentials: true //Để bật cookie HTTP qua CORS
}))


app.post('/auth/login', (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        console.log('email>>', email);
        if(email !== 'anonystick@gmail.com' || password !== 'password'){
            res.status(400);
            throw new Error('invalid infor')
        }
        const payload = {
            email: email
        }
        const token = jwt.sign(payload, SECRET);

        // https://keeplearning.dev/nodejs-jwt-authentication-with-http-only-cookie-5d8a966ac059
        res.cookie('access_token', token, {
            maxAge: 365 * 24 * 60 * 60 * 100,
            httpOnly: true,
            // secure: true;
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
            // path: '/',
        })
        res.status(200).json({email, password});
    }catch (err){
        throw err
    }
    
})


app.use('/api/users', (req, res) => {
    const token = req.cookies.access_token;

    console.log('req>>>', req);
    console.log('cookie>>>', token);
    try{
        const decoded = jwt.verify(token, SECRET);
        res.status(200).json(users);
    }catch(err){
        res.status(400)
        throw err;
    }
    
})

app.use((err, req, res, next)=> {
    res.json(err)
})

app.listen(port, () => {
    console.info(`listening on port ${port}`);
})