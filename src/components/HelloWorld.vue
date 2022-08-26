<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          欢迎来到Viper支付系统
        </h1>

        <p class="subheading font-weight-regular">
          这是加入Viper Prime的入口，将为Viper Prime会员提供更好的用户体验
        </p>
      </v-col>
      <v-col cols="12">
        <v-btn class="ma-2"
               color="primary"
               rounded
               @click="goToLogin">
          登录
        </v-btn>
        or
        <v-btn class="ma-2"
               color="primary"
               rounded
               @click="goToSignup">
          注册
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {store} from "@/store";

  export default {
    name: 'HelloWorld',

    data: () => ({
      goToLogin() {
        store.page = "LoginPage"
      },
      goToSignup() {
        store.page = "SignupPage"
      }
    }),
  }
</script>
