<template >
  <v-btn dark @click="showWarnings" >
    <v-layout class="pl-2">
      <v-badge v-model="show" color="red">
        <span slot="badge">{{value>99?"99+":value}}</span>
          <v-icon v-if="!show" color="ash">fas fa-bell-slash</v-icon>
          <v-icon v-else color="white">fas fa-bell</v-icon>
      </v-badge>
    </v-layout>
  </v-btn>
</template>

<script>
import socketio from "socket.io-client";

export default {
  data() {
    return {
      show: false,
      value: 0,
      socket: socketio(
        process.env.NODE_ENV === "production"
          ? "https://vitasenior-ws.eu-gb.mybluemix.net"
          : "http://192.168.161.13:8008/",
        {
          query: { token: this.$store.state.user.token },
          reconnection: true
        }
      )
    };
  },
  mounted() {
    this.value =
      this.$store.state.user.warnings + this.$store.state.user.errors;
    this.listenSocket();
  },
  beforeDestroy() {
    this.socket.close();
  },
  methods: {
    showWarnings() {
      if (this.$store.state.user.is_admin) this.$router.push("/error/list");
      else this.$router.push("/alert/list");
      this.value = 0;
      this.show = false;
    },
    listenSocket() {
      this.socket.on("connect", () => {
        console.log("connected");
      });
      this.socket.on("message", data => {
        console.log("received:", data.content, data.msg);
        if (
          data.content == "warning_env" ||
          data.content == "warning_bio" ||
          data.content == "error"
        ) {
          this.show = true;
          this.value = this.value + 1;
        }
      });
      this.socket.on("disconnect", () => {
        console.log("disconnected");
      });
      this.socket.on("unauthorized", error => {
        if (
          error.data.type == "UnauthorizedError" ||
          error.data.code == "invalid_token"
        ) {
          console.log("User's token has expired");
        }
      });
    }
  }
};
</script>

<style>
</style>


