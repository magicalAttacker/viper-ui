import {Status} from "./status";
import {Order} from "./order";

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://root:ksuLHyFMH1NxRl6t@cluster0.rrfq0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
export function login(user, res) {
    client.connect(() => {
        const collection = client.db("viper").collection("user");
        collection.findOne({ username: user.username }, (err, result) => {
            if (result !== null) {
                if (user.password === result.password) {
                    const status = new Status(1, 'login', 'login successful')
                    res.send(status.getStatus())
                } else {
                    const status = new Status(0, 'login', 'login failed caused by incorrect token')
                    res.send(status.getStatus())
                }
            } else {
                const status = new Status(0, 'login', 'login failed caused by no account exist')
                res.send(status.getStatus())
            }
        });
    })
}
export function signup(user, res) {
    client.connect(() => {
        const collection = client.db("viper").collection("user");
        collection.findOne({username: user.username}, (err, result) => {
            if (result !== null) {
                const status = new Status(0, 'signup', 'signup failed caused by the username already exist')
                res.send(status.getStatus())
                client.close()
                return
            }
            collection.insertOne(user.getUserInfo(), () => {
                const status = new Status(1, 'signup', 'signup successful')
                res.send(status.getStatus())
                client.close()
            })
        })
    });
}
export function userlist(res) {
    client.connect(() => {
        const collection = client.db('viper').collection('user')
        collection.find({}).toArray((error, result)=>{
            if (error) {
                throw error
            }
            res.send(result)
        })
    })
}
export function setvip(user, key, secret, res) {
    client.connect(async () => {
        const collection = client.db("viper").collection('user')
        const keyCollection = client.db('viper').collection('order')
        if (user.username + user.password !== key) {
            const errStatus = new Status(0, 'setvip', 'reject option')
            res.send(errStatus)
            return
        }
        const userResult = await collection.findOne({username: user.username, password: user.password})
        if (userResult === null) {
            const errStatus = new Status(0, 'setvip', 'reject option')
            res.send(errStatus)
            return
        }
        const keyResult = await keyCollection.findOne({username: user.username, status: 'paying'})
        if (keyResult === null) {
            const errStatus = new Status(0, 'setvip', 'please create order at first')
            res.send(errStatus)
            return
        }
        if (keyResult.uuid === secret) {
            const orderResult = await keyCollection.updateOne({
                username: user.username,
                status: 'paying'
            }, {$set: {status: 'finished'}})
            if (orderResult.modifiedCount !== 1) {
                const errStatus = new Status(0, 'setvip', 'reject option')
                res.send(errStatus)
                return
            }
            const status = new Status(1, 'setvip', 'change status successful')
            res.send(status)
        } else {
            const errStatus = new Status(0, 'setvip', 'reject option')
            res.send(errStatus)
        }
    })
}
export function createorder(user, key, msg, res) {
    client.connect(async () => {
        if (user.username + user.password !== key) {
            const errStatus = new Status(0, 'createorder', 'operation refused')
            res.send(errStatus)
            return
        }
        const orderCollection = client.db('viper').collection('order')
        const userCollection = client.db('viper').collection('user')
        const userResult = await userCollection.findOne({username: user.username, password: user.password})
        if (userResult === null) {
            const status = new Status(0, 'createorder', 'create order failed')
            res.send(status)
            return
        }
        const order = new Order(user, msg)
        const initResult = orderCollection.updateMany({username: user.username}, {$set: {status: 'expired'}})
        initResult.then(() => {
            orderCollection.insertOne(order.getOrderInfo(), (err) => {
                if (err) {
                    const errStatus = new Status(0, 'createorder', 'unknown error')
                    res.send(errStatus)
                    throw err
                }
                const status = new Status(1, 'createorder', 'create order successful')
                res.send(status)
            })
        })
    })
}
export function getuserorder(user, res) {
    client.connect(async () => {
        const orderCollection = client.db('viper').collection('order')
        const userCollection = client.db('viper').collection('user')
        const userResult = await userCollection.findOne({username: user.username, password: user.password})
        if (userResult === null) {
            const errStatus = new Status(0, 'getuserorder', 'auth error')
            res.send(errStatus)
            return
        }
        const orderResult = await orderCollection.find({username: user.username}).toArray()
        if (orderResult === null) {
            const errStatus = new Status(0, 'getuserorder', 'there is no order now')
            res.send(errStatus)
            return
        }
        res.send(orderResult)
    })
}
export function getallorder(user, res) {
    client.connect(async () => {
        const userCollection = client.db('viper').collection('user')
        const userResult = await userCollection.findOne({username: user.username, password: user.password})
        if (userResult === null) {
            const errStatus = new Status(0, 'getallorder', 'auth error')
            res.send(errStatus)
            return
        }
        if (!userResult.isAdmin) {
            const errStatus = new Status(0, 'getallorder', 'reject option')
            res.send(errStatus)
            return
        }
        const orderCollection = client.db('viper').collection('order')
        const orderResult = await orderCollection.find({}).toArray()
        if (orderResult === null) {
            const errStatus = new Status(0, 'getallorder', 'there is no order now')
            res.send(errStatus)
            return
        }
        res.send(orderResult)
    })
}
export function checkstatus(user, key, secret, res) {
    client.connect(async () => {
        if (key !== user.username + user.password) {
            const errStatus = new Status(0, 'checkstatus', 'reject option')
            res.send(errStatus)
            return
        }
        const userCollection = client.db('viper').collection('user')
        const userResult = await userCollection.findOne({username: user.username, password: user.password})
        if (userResult === null) {
            const errStatus = new Status(0, 'checkstatus', 'auth error')
            res.send(errStatus)
            return
        }
        const orderCollection = client.db('viper').collection('order')
        const orderResult = await orderCollection.findOne({username: user.username, status: 'paying', uuid: secret})
        if (orderResult === null) {
            const errStatus = new Status(0, 'checkstatus', 'reject option')
            res.send(errStatus)
            return
        }
        const date = new Date().toLocaleString('zh-CH',{timeZone:'Asia/Shanghai'})
        const dateNow = Date.parse(date)
        if (dateNow - Date.parse(orderResult.date) > 600000) {
            const userResult = await userCollection.updateOne({username: user.username}, {$set: {isVip: true}})
            if (userResult.modifiedCount !== 1) {
                const errStatus = new Status(0, 'checkstatus', 'error occur')
                res.send(errStatus)
                return
            }
            const orderResult = await orderCollection.updateOne({uuid: secret}, {$set: {status: 'finished'}})
            if (orderResult.modifiedCount !== 1) {
                const errStatus = new Status(0, 'checkstatus', 'error occur')
                res.send(errStatus)
                return
            }
            const status = new Status(1, 'checkstatus', 'change state successful')
            res.send(status)
        } else {
            const errStatus = new Status(0, 'checkstatus', 'please wait for confirm')
            res.send(errStatus)
        }
    })
}
export function rejectorder(user, key, secret, res) {
    client.connect(async () => {
        if (key !== user.username + user.password) {
            const errStatus = new Status(0, 'rejectorder', 'invalid operation')
            res.send(errStatus)
            return
        }
        const userCollection = client.db('viper').collection('user')
        const userResult = await userCollection.findOne({username: user.username, password: user.password})
        if (userResult === null) {
            const errStatus = new Status(0, 'rejectorder', 'auth error')
            res.send(errStatus)
            return
        }
        const orderCollection = client.db('viper').collection('order')
        const orderResult = await orderCollection.updateOne({username: user.username, status: 'paying', uuid: secret}, {$set: {status: 'rejected'}})
        if (orderResult.modifiedCount !== 1) {
            const errStatus = new Status(0, 'rejectorder', 'invalid operation')
            res.send(errStatus)
            return
        }
        const status = new Status(1, 'rejectorder', 'reject order successful')
        res.send(status)
    })
}