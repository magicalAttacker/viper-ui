export class User{
    constructor(username, password) {
        this.username = username
        this.password = password
        this.isAdmin = false
        this.isVip = false
        this.date = new Date().toLocaleString('zh-CH',{timeZone:'Asia/Shanghai'})
    }
    getUserInfo() {
        return {
            username: this.username,
            password: this.password,
            isAdmin: this.isAdmin,
            isVip: this.isVip,
            date: this.date
        }
    }
}