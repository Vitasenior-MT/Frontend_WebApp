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
import axios from "axios";
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
    event_bus.$emit("waiting", true);
    axios({
      method: "GET",
      url:
        process.env.NODE_ENV === "production"
          ? "https://vitasenior.eu-gb.mybluemix.net/check"
          : "http://192.168.161.94:8080/check",
      headers: this.$store.state.user.token
        ? {
            "Authorization": this.$store.state.user.token,
            "Content-Type": "application/json",
            "Accept-Version": "1.0.0",
            "Accept-Language": "pt"
          }
        : {
            "Content-Type": "application/json",
            "Accept-Version": "1.0.0",
            "Accept-Language": "pt"
          }
    })
      .then(() => {
        if (this.$store.state.user.is_admin) {
          this.$router.push("/backoffice/vitabox/list");
        } else if (this.$store.state.user.is_doctor) {
          this.$router.push("/doctoroffice/dashboard");
        } else {
          this.$router.push("/frontoffice/dashboard");
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
  padding-top: 90px;
  padding-right: 25px;
  padding-left: 25px;
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
</style>
