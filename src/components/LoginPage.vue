<template>
  <v-container>
    <v-card
        class="mx-auto"
        max-width="600">
      <v-img
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="200"
          src="@/assets/sierra.jpg"
          text>
        <v-card-title>
          请输入凭据
        </v-card-title>
      </v-img>
      <v-container>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  md="6"
              >
                <v-text-field
                    v-model="username"
                    :rules="[rules.username]"
                    hint="至少要5位"
                    label="请输入你的账号(邮箱📫)"
                    required
                ></v-text-field>
              </v-col>

              <v-col
                  cols="12"
                  md="6"
              >
                <v-text-field
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    v-model="password"
                    :rules="[rules.password]"
                    :type="show ? 'text' : 'password'"
                    label="请输入你的密码🔑"
                    hint="至少要有6位"
                    @click:append="show = !show"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-dialog
              v-model="dialog"
              persistent
              width="300"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  v-bind="attrs"
                  v-on="on"
                  @click="login"
                  color="pink"
                  :disabled="!valid || isEmpty"
                  text
              >
                登录
              </v-btn>
            </template>
            <v-card
                color="primary"
                dark
            >
              <v-card-text>
                {{ tip }}
                <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                ></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
              @click="goToSignup"
              color="pink"
              text
          >
            没有账号？去注册
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import {store} from "@/store";

export default {
  name: "LoginPage",
  data: () => ({
    valid: true,
    show: false,
    dialog: false,
    username: null,
    password: null,
    tip: null,
    rules: {
      username: user => user.length >= 5 || '输入的位数不够5位哦，请重新输入',
      password: pass => pass.length >= 6 || '输入的位数不够6位哦，请重新输入'
    }
  }),
  methods: {
    async login() {
      this.tip = "正在登录"
      const result = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'username': this.username,
          'password': this.password,
        })
      })
      const jsonRes = await result.json()
      if (jsonRes.code === 1) {
        store.isLogin = true
        store.username = this.username
        store.password = this.password
        this.tip = "登录成功"
        setTimeout(() => {
          this.dialog = false
          setTimeout(() => {
            store.page = "MainPage"
          }, 1000)
        }, 2000)
      } else {
        this.tip = "登录失败" + "(" + jsonRes.msg + ")"
        setTimeout(() => {
          this.dialog = false
        }, 5000)
      }
    },
    goToSignup() {
      store.page = "SignupPage"
    }
  },
  computed: {
    isEmpty() {
      return this.username === null || this.password === null
    }
  }
}
</script>

<style scoped>

</style>