<template>
  <div id="user_profile">
    <v-menu offset-y bottom left v-model="profile_menu">
      <div slot="activator">
        <v-list class="pa-0 raven hidden-sm-and-down">
          <v-list-tile avatar>
            <v-list-tile-avatar style="min-width: 40px;">
              <img v-if="user_photo" :src="user_photo">
              <v-icon v-else color="white">fas fa-user</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">welcome</v-list-tile-sub-title>
              <v-list-tile-title
                class="title font-weight-light white--text"
              >{{$store.state.user.name}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action style="min-width: 20px;">
              <v-icon color="ash">fas fa-ellipsis-v</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-avatar class="raven hidden-md-and-up" size="45">
          <img v-if="user_photo" :src="user_photo">
          <v-icon v-else color="white">fas fa-user</v-icon>
        </v-avatar>
      </div>
      <v-list dense dark subheader>

        <v-list-tile class="hidden-md-and-up mb-1" style="height:45px !important;">
          <v-list-tile-content style="height:45px !important;">
            <v-list-tile-sub-title class="primary--text">welcome</v-list-tile-sub-title>
            <v-list-tile-title
              class="headline font-weight-light white--text"
            >{{$store.state.user.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset class="hidden-md-and-up"></v-divider>

        <v-list-tile @click="showWarnings" class="mt-1">
          <v-list-tile-avatar>
            <v-badge v-model="this.show" color="red">
              <span slot="badge">{{this.value>99?"99+":value}}</span>
              <v-icon v-if="!this.show" :color="!connected?'ash':'white'">fas fa-bell-slash</v-icon>
              <v-icon v-else color="white">fas fa-bell</v-icon>
            </v-badge>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Warnings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="showNotifications">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-envelope</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Notifications</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="showVideocall">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-video</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Videocall</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>
        <v-subheader inset>Settings</v-subheader>

        <v-list-tile @click="goToChgPass">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-key</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Change password</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="chg_photo_dialog=true">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-user-circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Change photo</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="logout">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-sign-out-alt</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-dialog max-width="400" v-model="chg_photo_dialog">
      <change-photo :to_patient="false" @changed="changePhoto" @close="chg_photo_dialog=false"></change-photo>
    </v-dialog>

    <!-- <v-dialog v-model="videocall_dialog" dark max-width="900">
      <video-call
        :openned="videocall_dialog"
        @close="videocall_dialog=false"
        @open="videocall_dialog=true"
      ></video-call>
    </v-dialog>-->
  </div>
</template>

<script>
import socketio from "socket.io-client";
import { event_bus } from "@/plugins/bus.js";
import Videocall from "./Videocall.vue";
import ChgPhoto from "@/components/user/utils/ChgPhoto.vue";

export default {
  name: "user_profile",
  data: () => {
    return {
      profile_menu: false,
      videocall_dialog: false,
      chg_photo_dialog: false,
      show: false,
      connected: false,
      value: 0,
      socket: null,
      user_photo: null
    };
  },
  mounted() {
    this.user_photo = this.$store.state.user.photo
      ? event_bus.$data.url + "/file/" + this.$store.state.user.photo
      : null;
    this.value =
      this.$store.state.user.warnings + this.$store.state.user.errors;
    if (this.value > 0) this.show = true;
    this.socket = socketio(
      process.env.NODE_ENV === "production"
        ? "https://vitasenior-ws-test.eu-gb.mybluemix.net/socketio"
        : "http://192.168.161.63:8008/socketio",
      {
        query: { token: this.$store.state.user.token },
        reconnection: true
      }
    );
    this.listenSocket();
  },
  beforeDestroy() {
    this.socket.close();
  },
  methods: {
    showVideocall() {
      this.profile_menu = false;
      this.videocall_dialog = true;
    },
    showNotifications() {
      this.$router.push("/notification/list");
    },
    showWarnings() {
      if (this.$store.state.user.is_admin) this.$router.push("/error/list");
      else this.$router.push("/alert/list");
      this.value = 0;
      this.show = false;
    },
    goToChgPass() {
      this.$router.push("/chgpass");
    },
    listenSocket() {
      this.socket.on("message", data => {
        if (data.content === "hello") this.connected = true;
        if (data.content === "unauthorized") {
          event_bus.$emit("toast", {
            message: "User's token has expired",
            type: "error"
          });
        }
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
        this.connected = false;
      });
      this.socket.on("Unauthorized", error => {
        if (
          error.data.type == "UnauthorizedError" ||
          error.data.code == "invalid_token"
        ) {
          this.connected = false;
          event_bus.$emit("toast", {
            message: "User's token has expired",
            type: "error"
          });
        }
      });
    },
    changePhoto() {
      this.user_photo = this.$store.state.user.photo
        ? event_bus.$data.url + "/file/" + this.$store.state.user.photo
        : null;
      this.chg_photo_dialog = false;
    },
    logout() {
      this.$router.push("/");
      this.$store.commit("cleanData");
    }
  },
  components: {
    "video-call": Videocall,
    "change-photo": ChgPhoto
  }
};
</script>

<style>
</style>
