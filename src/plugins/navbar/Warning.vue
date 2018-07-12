<template >
  <v-layout style="padding-top:15px">
    <v-badge v-model="show" overlap color="red">
      <span slot="badge" >3</span>
      <v-btn v-if="!isadmin" color="primary" fab @click="show = !show" :to='"/alerts/list"' style="height:45px">
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
  props: { isadmin: Boolean },
  data() {
    return {
      show: true,
      socket: null
    };
  },
  mounted() {
    var socket = socketio("http://localhost:8000/", {
      query: { token: this.$store.state.user.token }
    });
    socket.on("connect", function() {
      console.log("connected: "); // true
      console.log(socket);
    });
    socket.on("message", function(data) {
      console.log("message: ", data);
    });
    socket.on("data", function(data) {
      console.log("data: ", data);
    });
    socket.on("disconnect", function() {
      console.log("disconnected: "); // true
      console.log(socket);
    });
    socket.on("unauthorized", function(error) {
      if (
        error.data.type == "UnauthorizedError" ||
        error.data.code == "invalid_token"
      ) {
        console.log("User's token has expired");
      }
    });
    // this.initWS();
  }
  // beforeDestroy() {
  //   this.closeWS();
  // },
  // methods: {
  //   initWS() {
  //     this.socket.open();
  //     console.log(this.socket);
  //   },
  //   closeWS() {
  //     this.socket.close();
  //   },
  //   switchWS() {
  //     if (this.socket.connected) this.closeWS();
  //     else this.initWS();
  //   }
  // }
};
</script>

<style>
</style>


