<template>
  <v-app>
    <progress-bar></progress-bar>

    <navbar :logged="logged" :isadmin="is_admin"></navbar>

    <main>
      <transition name="fade">
        <div id="navpanel">
          <router-view></router-view>
        </div>
      </transition>
    </main>


    <log></log>
    <foot></foot>
  </v-app>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import Log from "@/components/utils/Log.vue";
import Footer from "@/components/utils/Footer.vue";
import Progress from "./components/utils/Progress.vue";

export default {
  name: "app",
  data() {
    return {
      logged: false,
      is_admin: false
    };
  },
  mounted() {
    this.logged = this.$store.state.user.token ? true : false;
    this.is_admin = this.$store.state.user.is_admin ? true : false;
    event_bus.$on("login", () => {
      this.logged = true;
      this.is_admin = this.$store.state.user.is_admin;
      if (this.is_admin) {
        this.$router.push("/backoffice/vitabox/list");
      } else {
        this.$router.push("/dashboard");
      }
      event_bus.$emit("waiting", false);
    });
    event_bus.$on("logout", () => {
      this.logged = false;
      this.$router.push("/");
      this.$store.commit("cleanData");
    });
  },
  components: {
    foot: Footer,
    log: Log,
    "progress-bar": Progress
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
@media only screen and (min-width: 960px) {
  main {
    height: 100%;
    position: relative;
  }
}
@media only screen and (max-width: 960px) {
  main {
    height: 100%;
    position: relative;
  }
}
a {
  text-decoration: none;
}
i {
  color: inherit !important;
}
.expansion-panel--inset .expansion-panel__container--active,
.expansion-panel--popout .expansion-panel__container--active {
  box-shadow: none !important;
}
.bottom-sheet {
  height: 100% !important;
}
.bottom-sheet .card {
  height: 100% !important;
  overflow-y: auto;
}
.input-group__details {
  min-height: 0 !important;
}
.btn {
  min-width: 0;
}
.content--wrap {
  padding: 1%;
}

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

#navpanel {
  padding-top: 65px;
  padding-left: 10px;
  padding-right: 10px;
  height: calc(100% - 36);
}
</style>
