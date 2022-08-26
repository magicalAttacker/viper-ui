<template>
  <v-container>
    <v-card>
        <v-card-title>{{ greeting }}</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import {store} from "@/store";
export default {
  name: "MainPage",
  data: () => ({

  }),
  computed: {
    greeting() {
      const date = new Date()
      return (date.getHours() < 12 ? "上午" : "下午") + "好, " + store.username
    }
  }
}
</script>

<style scoped>

</style>