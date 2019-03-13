<template>
  <div id="user_profile">
    <v-menu offset-y bottom left v-model="profile_menu">
      <div slot="activator">
        <v-list class="pa-0 raven hidden-sm-and-down">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img v-if="user_photo" :src="user_photo">
              <v-icon v-else color="white">fas fa-user</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">{{$t('navbar.welcome')}}</v-list-tile-sub-title>
              <v-list-tile-title
                class="title font-weight-light white--text"
              >{{$store.state.user.name}}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action style="min-width: 20px;">
              <v-icon id="profile-menu-icon" class="profile-no-warning">fas fa-ellipsis-v</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-avatar class="raven hidden-md-and-up" size="45">
          <img v-if="user_photo" :src="user_photo">
          <v-icon v-else color="white">fas fa-user</v-icon>
        </v-avatar>
      </div>
      <v-list dense dark subheader>
        <v-list-tile @click="showWarnings" class="mt-1">
          <v-list-tile-avatar>
            <v-badge v-model="this.show" color="red">
              <span slot="badge">{{this.value>99?"99+":value}}</span>
              <v-icon v-if="!this.show" :color="!connected?'ash':'white'">fas fa-bell-slash</v-icon>
              <v-icon v-else color="white">fas fa-bell</v-icon>
            </v-badge>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('navbar.warnings')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="showNotifications">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-envelope</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('navbar.notifications')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="showVideocall">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-video</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('navbar.videocall')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider inset></v-divider>
        <v-subheader inset>{{$t('navbar.settings')}}</v-subheader>

        <v-list-tile @click="chg_pass_dialog=true">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-key</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('navbar.change_pass')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="chg_photo_dialog=true">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-user-circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('navbar.change_photo')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="chg_lang_dialog=true">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-globe</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('navbar.change_language')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="logout">
          <v-list-tile-avatar>
            <v-icon color="white">fas fa-sign-out-alt</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('navbar.logout')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-dialog max-width="400" v-model="chg_pass_dialog">
      <change-pass @close="chg_pass_dialog=false"></change-pass>
    </v-dialog>
    <v-dialog max-width="400" v-model="chg_photo_dialog">
      <change-photo :to_patient="false" @changed="changePhoto" @close="chg_photo_dialog=false"></change-photo>
    </v-dialog>
    <v-dialog max-width="400" v-model="chg_lang_dialog">
      <change-lang @close="chg_lang_dialog=false"></change-lang>
    </v-dialog>

    <v-dialog v-model="videocall_dialog" max-width="900">
      <video-call
        :openned="videocall_dialog"
        @close="videocall_dialog=false"
        @open="videocall_dialog=true"
      ></video-call>
    </v-dialog>
  </div>
</template>

<script>
import socketio from "socket.io-client";
import { event_bus } from "@/plugins/bus.js";
import Videocall from "./Videocall.vue";
import ChgPhoto from "@/components/user/utils/ChgPhoto.vue";
import ChgLanguage from "@/components/user/utils/ChgLanguage.vue";
import ChgPwd from "@/components/user/auth/ChgPwd.vue";
import { setInterval, clearInterval } from "timers";

export default {
  name: "user_profile",
  data: () => {
    return {
      profile_menu: false,
      videocall_dialog: false,
      chg_pass_dialog: false,
      chg_photo_dialog: false,
      chg_lang_dialog: false,
      show: false,
      connected: false,
      value: 0,
      socket: null,
      user_photo: null,
      icon_loop: null
    };
  },
  mounted() {
    this.user_photo = this.$store.state.user.photo
      ? event_bus.$data.url + "/file/" + this.$store.state.user.photo
      : null;
    this.socket = socketio(
      process.env.NODE_ENV === "production"
        ? "https://vitasenior-ws-test.eu-gb.mybluemix.net/socketio"
        : "http://192.168.161.197:8008/socketio",
      {
        query: { token: this.$store.state.user.token },
        reconnection: true
      }
    );
    this.listenSocket();
  },
  beforeDestroy() {
    clearInterval(this.icon_loop);
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
      this.stopIconLoop();
    },
    listenSocket() {
      this.socket.on("message", data => {
        // console.log("WS message: ", data);
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
          this.$store.commit("setUserWarningsErrors", this.value);
          this.startIconLoop();
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
    },
    startIconLoop() {
      if (!this.icon_loop) {
        document.getElementById("profile-menu-icon").className =
          "profile-warning-2 v-icon fas fa-ellipsis-v theme--light";
        this.icon_loop = setInterval(() => {
          let x = document.getElementById("profile-menu-icon");
          if (x.className.includes("-1"))
            x.className =
              "profile-warning-2 v-icon fas fa-ellipsis-v theme--light ";
          else
            x.className =
              "profile-warning-1 v-icon fas fa-ellipsis-v theme--light";
        }, 1000);
      }
    },
    stopIconLoop() {
      if (this.icon_loop) {
        clearInterval(this.icon_loop);
        document.getElementById("profile-menu-icon").className =
          "v-icon profile-no-warning fas fa-ellipsis-v theme--light";
        this.icon_loop = null;
      }
    }
  },
  components: {
    "video-call": Videocall,
    "change-photo": ChgPhoto,
    "change-pass": ChgPwd,
    "change-lang": ChgLanguage
  }
};
</script>

<style>
#profile-menu-icon {
  transition: all 1s ease-in-out;
}

.profile-no-warning {
  color: #5b5b5b !important;
  font-size: 24px;
}

.profile-warning-1 {
  color: #ff0000 !important;
  font-size: 24px;
}
.profile-warning-2 {
  color: #ff6464 !important;
  font-size: 36px;
}
</style>
