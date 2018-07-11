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
img {
  width: 100%;
  height: auto;
}

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
  height: 100%;
  background: linear-gradient(-45deg, #7741f4, #42f4a1, #7741f4);
  background-size: 400% 400%;
  -webkit-animation: Gradient 5s ease infinite;
  -moz-animation: Gradient 5s ease infinite;
  animation: Gradient 5s ease infinite;
}

@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.main-title {
  position: absolute;
  margin: 0;
  padding: 0;
  color: #3faf7d;
  font-size: 20px;
  text-align: center;
  top: 50%;
  left: 50%;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
}

.demo .main-title {
  text-transform: uppercase;
  font-size: 4.2em;
  letter-spacing: 0.1em;
}

.main-title .thin {
  font-weight: 200;
  color: #f9f1e9;
}

@media only screen and (max-width: 768px) {
  .demo .main-title {
    font-size: 3em;
  }
}
</style>
