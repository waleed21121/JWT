require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const userModel = require('./user.model');

const app = express();

app.use(bodyParser.json());

app.get('/users', authenticateToken, (req, res, next) => {
    res.json([{name:'waleed'}, {name:'alaa'}]);
})

app.post('/register', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await userModel.createNewUser(username, password);
        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(400);
    }
})

app.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await userModel.login(username, password);
        const user = {username: username, password: password};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({token: accessToken});
    } catch (err) {
        res.sendStatus(401);
    }
})

function authenticateToken (req, res, next) {
    const token = req.headers('authorization');
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    })
}
app.listen(3000, () => {
    console.log('lestining on port 3000');
})
