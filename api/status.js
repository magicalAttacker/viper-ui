export class Status {
    constructor(code, type, msg) {
        this.code = code
        this.type = type
        this.msg = msg
    }
    getStatus() {
        return {
            code: this.code,
            type: this.type,
            msg: this.msg
        }
    }
}