import { reactive } from 'vue'
export const store = reactive({
    username: null,
    password: null,
    isLogin: false,
    page: "HelloWorld",
})