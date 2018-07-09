<template>
  <div id="frontoffice">
    <v-btn small color="primary" class="mt-0" block dark to="/vitabox/register">Register Vitabox</v-btn>
    <v-divider class="vitaboxDivider"></v-divider>
    <v-list class="office_menu py-0" three-line>
      <router-link v-for="(item, index) in vitaboxes" :key="item.id" @click.native="selectedVitabox(item)" :to='"/dashboard"'>
      <v-divider v-if="index !== 0" class="vitaboxDivider" :inset="true"></v-divider>
        <v-list-tile class="vitaboxSelector">
          <v-list-tile-avatar style="color:#3faf7d">
            <v-icon>fa fa-tv</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title style="color:#3faf7d;">Vitabox</v-list-tile-title>
            <v-list-tile-sub-title style="color:white; font-size:small">{{ item.address }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </router-link>
    </v-list>
    <v-divider class="vitaboxDivider"></v-divider>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "frontoffice",
  data: () => {
    return {
      selected: -1,
      vitaboxes: [],
      vitabox: null
    };
  },
  created() {
    this.getVitaboxes();
    event_bus.$on("new_vitabox", box => {
      this.vitaboxes.push(box);
    });
  },
  methods: {
    getVitaboxes() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox")
        .then(response => {
          this.vitaboxes = response.data.vitaboxes;
          if (response.data.vitaboxes.length > 0) {
            this.selectedVitabox(response.data.vitaboxes[0]);
          }
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", { message: error.message, type: "error" });
          }
          event_bus.$emit("waiting", false);
        });
    },
    selectedVitabox(vitaboxData) {
      this.$store.commit("setVitaboxData", vitaboxData);
    }
  }
};
</script>

<style>
.vitaboxSelector:hover {
  background-color: #5b5b5b !important;
}

.vitaboxDivider {
  background-color: white !important;
}
</style>


