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
          ? "https://vitasenior-worker.eu-gb.mybluemix.net"
          : "http://192.168.161.224:8000/",
        {
          query: { token: this.$store.state.user.token },
          reconnection: true
        }
      )
    };
  },
  watch: {
    value(v) {
      this.show = v > 0;
    }
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
      if(this.$store.state.user.is_admin) this.$router.push("/error/list");
      else this.$router.push("/alert/list");
    },
    listenSocket() {
      this.socket.on("connect", function() {
        console.log("connected");
      });
      this.socket.on("message", function(data) {
        console.log("message: ", data);
        if (data === "warning" || data === "error") this.value++;
      });
      this.socket.on("disconnect", function() {
        console.log("disconnected");
      });
      this.socket.on("unauthorized", function(error) {
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


