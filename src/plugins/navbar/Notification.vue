<template >
  <v-btn dark @click="showWarnings" >
    <v-icon color="white">fas fa-envelope</v-icon>
  </v-btn>
</template>

<script>
import socketio from "socket.io-client";

export default {
  data() {
    return {};
  },
  methods: {
    showWarnings() {
      this.$router.push("/notification/list");
      this.value = 0;
      this.show = false;
    }
  }
};
</script>

<style>
</style>