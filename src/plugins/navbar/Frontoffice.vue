<template>
  <div id="frontoffice">
    <v-btn
      small
      color="primary"
      class="mt-0"
      block
      dark
      to="/frontoffice/vitabox/register"
    >{{$t('navbar.register_vitabox')}}</v-btn>
    <v-divider class="vitaboxDivider"></v-divider>
    <v-list class="office_menu py-0" three-line>
      <router-link
        v-for="(item, index) in this.$store.state.vitaboxes"
        :key="item.id"
        @click.native="selectedVitabox(item)"
        :to="'/frontoffice/dashboard'"
      >
        <v-divider v-if="index !== 0" class="vitaboxDivider" :inset="true"></v-divider>
        <v-list-tile class="vitaboxSelector">
          <v-list-tile-avatar class="primary--text">
            <v-icon>fa fa-tv</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title class="primary--text">Vitabox</v-list-tile-title>
            <v-list-tile-sub-title class="white--text" small>{{getVitaboxName(item)}}</v-list-tile-sub-title>
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
  created() {
    this.getVitaboxes();
  },
  methods: {
    getVitaboxes() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + true)
        .then(response => {
          this.$store.commit("setVitaboxesList", response.data.vitaboxes);
          if (response.data.vitaboxes.length > 0) {
            this.selectedVitabox(response.data.vitaboxes[0]);
          }
          event_bus.$emit("update_peers");
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
    },
    getVitaboxName(item) {
      return (
        item.locality
          .replace(/_/g, " ")
          .split(" ")
          .map(x => x[0].toUpperCase() + x.substr(1))
          .join(" ") +
        " - " +
        item.address
      );
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


