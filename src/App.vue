<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title class="white--text">Viper支付系统</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
          v-if="showLoginButton"
          text
          @click="goToLogin"
      >
        <span class="mr-2">登录</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <component :is="store.page"/>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";
import MainPage from "@/components/MainPage";
import { store } from "@/store";

export default {
  name: 'App',

  components: {
    HelloWorld,
    LoginPage,
    SignupPage,
    MainPage,
  },

  data: () => ({
    store,
  }),

  methods: {
    goToLogin() {
      store.page = "LoginPage"
    }
  },

  computed: {
    showLoginButton() {
      return !store.isLogin && store.page !== "LoginPage";
    }
  }
};
</script>
