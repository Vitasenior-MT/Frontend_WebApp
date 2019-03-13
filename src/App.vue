<template>
  <v-app>
    <progress-bar></progress-bar>

    <navbar v-if="checked"></navbar>

    <main v-if="checked">
      <transition name="fade">
        <div id="navpanel" class="bckground1">
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
  data: () => {
    return {
      checked: false
    };
  },
  mounted() {
    let browserLang = navigator.language || navigator.userLanguage;
    this.$i18n.locale = ["en", "pt"].includes(browserLang.substring(0, 2))
      ? browserLang.substring(0, 2)
      : "en";

    event_bus.$emit("waiting", true);
    event_bus.$data.http
      .get("/check")
      .then(() => {
        if (this.$store.state.user.is_admin) {
          this.$router.push("/backoffice/vitabox/list");
        } else {
          this.$router.push("/alert/list");
        }
        event_bus.$emit("waiting", false);
        this.checked = true;
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status !== 401)
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
        } else {
          event_bus.$emit("toast", { message: error.message, type: "error" });
        }
        this.$router.push("/");
        this.$store.commit("cleanData");
        this.checked = true;
        event_bus.$emit("waiting", false);
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

#navpanel {
  padding-top: 70px;
  padding-right: 5px;
  padding-left: 5px;
  padding-bottom: 40px;
  height: 100%;
  background-image: linear-gradient(
    to right top,
    #845ec2,
    #d65db1,
    #d65db1,
    #ff9671,
    #ffc75f,
    #f9f871
  );
}
.main-title {
  position: absolute;
  margin: 0;
  padding: 0;
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
.headers {
  color: #f37027 !important;
}
.dark-hover:hover {
  background-color: #5e5e5e;
  cursor: pointer;
}
.light-hover:hover {
  background-color: #e2e2e2;
  cursor: pointer;
}
.primary-hover {
  background-color: #ffc25f !important;
}
.primary-hover:hover {
  background-color: #ffb53d !important;
  cursor: pointer;
}
.align-vertical-center {
  top: 50%;
  transform: translateY(-50%);
  position: relative;
}
</style>
