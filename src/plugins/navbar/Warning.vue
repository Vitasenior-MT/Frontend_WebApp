<template >
  <v-layout style="padding-top:15px">
    <v-badge v-model="show" overlap color="red">
      <span slot="badge" >3</span>
      <v-btn v-if="!isadmin && !isdoctor" color="primary" fab @click="show = !show" :to='"/alerts/list"' style="height:45px">
        <v-icon color="white">fas fa-bell</v-icon>
      </v-btn>
      <v-btn v-else color="primary" fab @click="show = !show" style="height:45px">
        <v-icon color="white">fas fa-bell</v-icon>
      </v-btn>
    </v-badge>
  </v-layout>
</template>

<script>
import socketio from "socket.io-client";

export default {
  props: { isadmin: Boolean, isdoctor: Boolean },
  data() {
    return {
      show: true,
      socket: socketio(
        process.env.NODE_ENV === "production"
          ? "https://vitasenior-worker.eu-gb.mybluemix.net"
          : "http://192.168.161.224:8000/",
        {
          query: { token: this.$store.state.user.token }
        }
      )
    };
  },
  mounted() {
    this.socket.on("connect", function() {
      console.log("connected");
    });
    this.socket.on("message", function(data) {
      console.log("message: ", data);
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
  },
  beforeDestroy() {
    this.socket.close();
  }
};
</script>

<style>
</style>


