import { v4 as uuidv4 } from 'uuid'
export class Order {
    constructor(user, msg) {
        this.user = user
        this.status = 'paying'
        this.uuid = uuidv4()
        this.msg = msg
        this.date = new Date().toLocaleString('zh-CH',{timeZone:'Asia/Shanghai'})
    }
    getOrderInfo() {
        return {
            username: this.user.username,
            status: this.status,
            uuid: this.uuid,
            msg: this.msg,
            date: this.date
        }
    }
}