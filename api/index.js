import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import {User} from "./user";
import {
    checkstatus,
    createorder,
    getallorder,
    getuserorder,
    login,
    rejectorder,
    setvip,
    signup,
    userlist
} from "./utils";
var bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/api', (req, res) => {
    const password = uuidv4()
    const date = new Date().toLocaleString('zh-CH',{timeZone:'Asia/Shanghai'})
    const json = {
        date: date,
        password: password
    }
    res.send(json)
})
app.post('/api/signup', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = new User(username, password)
    signup(user, res)
})
app.post('/api/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = new User(username, password)
    login(user, res)
})
app.post('/api/setvip', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const key = req.body.key
    const secret = req.body.secret
    const user = new User(username, password)
    setvip(user, key, secret, res)
})
app.post('/api/rejectorder', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const key = req.body.key
    const secret = req.body.secret
    const user = new User(username, password)
    rejectorder(user, key, secret, res)
})
app.post('/api/checkstatus', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const key = req.body.key
    const secret = req.body.secret
    const user = new User(username, password)
    checkstatus(user, key, secret, res)
})
app.post('/api/createorder', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const key = req.body.key
    const msg = req.body.msg
    const user = new User(username, password)
    createorder(user, key, msg, res)
})
app.get('/api/getuserlist', (req, res) => {
    userlist(res)
})
app.get('/api/getuserorder', (req, res) => {
    const username = req.query.username
    const password = req.query.password
    const user = new User(username, password)
    getuserorder(user, res)
})
app.get('/api/getallorder', (req, res) => {
    const username = req.query.username
    const password = req.query.password
    const user = new User(username, password)
    getallorder(user, res)
})
module.exports = app