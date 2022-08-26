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
          请完成注册
        </v-card-title>
      </v-img>
      <v-container>
        <v-form v-model="valid">
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  md="4"
              >
                <v-text-field
                    v-model="username"
                    :rules="[rules.username]"
                    hint="至少要5位"
                    label="请输入你要注册的账号(邮箱📫)"
                    required
                ></v-text-field>
              </v-col>

              <v-col
                  cols="12"
                  md="4"
              >
                <v-text-field
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    v-model="password"
                    :rules="[rules.password]"
                    :type="showPass ? 'text' : 'password'"
                    label="请输入你设置的密码🔑"
                    hint="至少要有6位"
                    @click:append="showPass = !showPass"
                    required
                ></v-text-field>
              </v-col>

              <v-col
                  cols="12"
                  md="4"
              >
                <v-text-field
                    :append-icon="showRep ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[isRepeat]"
                    :type="showRep ? 'text' : 'password'"
                    v-model="repPassword"
                    label="请重复你设置的密码🔑"
                    hint="请保持和上一遍输入的相同"
                    @click:append="showRep = !showRep"
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
                  @click="signup"
                  color="pink"
                  :disabled="!valid || isEmpty"
                  text
              >
                注册
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
              @click="goToLogin"
              color="pink"
              text
          >
            已经注册？去登陆
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import {store} from "@/store";

export default {
  name: "SignupPage",
  data: () => ({
    tip: null,
    valid: true,
    dialog: false,
    showPass: false,
    showRep: false,
    username: null,
    password: null,
    repPassword: null,
    rules: {
      username: user => user.length >= 5 || '输入的位数不够5位哦，请重新输入',
      password: pass => pass.length >= 6 || '输入的位数不够6位哦，请重新输入',
    }
  }),
  methods: {
    async signup() {
      this.tip = "正在注册"
      const result = await fetch('api/signup', {
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
        this.tip = "注册成功"
        setTimeout(() => {
          this.dialog = false
          setTimeout(() => {
            store.page = "MainPage"
          }, 1000)
        }, 2000)
      } else {
        this.tip = "注册失败" + "(" + jsonRes.msg + ")"
        setTimeout(() => {
          this.dialog = false
        }, 5000)
      }
    },
    goToLogin() {
      store.page = "LoginPage"
    }
  },
  computed: {
    isRepeat() {
      if (this.password === this.repPassword) {
        return true
      } else {
        return '两次输入的密码不一致'
      }
    },
    isEmpty() {
      return this.username === null || this.password === null
    }
  }
}
</script>

<style scoped>

</style>