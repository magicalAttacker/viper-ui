<template>
  <v-container>
    <v-card>
      <v-card-title>{{ greeting }}</v-card-title>
      <v-card-text>
        是否为会员：{{ isVip }}<br>
        注册时间：{{ date }}
      </v-card-text>
      <v-card-actions>
        <v-btn
            @click="refreshInfo"
            color="pink"
            text
        >
          刷新
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import {store} from "@/store";
export default {
  name: "MainPage",
  data: () => ({
    isVip: "正在加载",
    date: "正在加载"
  }),
  async mounted() {
    const result = await fetch("api/checkuserinfo",{
      method: 'POST',
          headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'username': store.username,
        'password': store.password,
        'key': store.username + store.password
      })
    })
    const info = await result.json()
    store.isAdmin = info.isAdmin
    store.isVip = info.isVip
    this.isVip = store.isVip ? "永久会员" : "非会员"
    this.date = info.date
  },
  computed: {
    greeting() {
      const date = new Date()
      return (date.getHours() < 12 ? "上午" : "下午") + "好, " + store.username
    },
  },
  methods: {
    async refreshInfo() {
      this.isVip = "正在刷新"
      const result = await fetch("api/checkuserinfo", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'username': store.username,
          'password': store.password,
          'key': store.username + store.password
        })
      })
      const info = await result.json()
      store.isAdmin = info.isAdmin
      store.isVip = info.isVip
      this.isVip = store.isVip ? "永久会员" : "非会员"
    }
  }
}
</script>

<style scoped>

</style>