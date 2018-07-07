<template>
  <v-list id="frontoffice" class="office_menu"  three-line>
    
    <router-link v-for="item in vitaboxes" :key="item.id" @click.native="selectedVitabox(item)" :to='"/dashboard"'>
    <v-divider v-if="item == vitaboxes[0]" class="vitaboxDivider"></v-divider>
    <v-divider v-else class="vitaboxDivider" :inset="true"></v-divider>
    <v-list-tile class="vitaboxSelector">
      <v-list-tile-avatar style="color:#3faf7d">
        <v-icon>fa fa-tv</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title style="color:#3faf7d;">Vitabox</v-list-tile-title>
        <v-list-tile-sub-title style="color:white; font-size:small">{{ item.address }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider v-if="item == vitaboxes[vitaboxes.length-1]" class="vitaboxDivider"></v-divider>
    </router-link>
  </v-list>  

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
  },
  mounted() {
    this.links.frontoffice.map((item, index) => {
      if (item.path === this.$route.path) this.select(index);
    });
  },
  watch: {
    $route: function(route) {
      this.links.frontoffice.map((item, index) => {
        if (item.path === route.path) this.select(index);
      });
    }
  },
  methods: {
    select(i) {
      if (this.selected !== -1) {
        document.getElementsByClassName("office_options")[
          this.selected
        ].className =
          "office_options office_notchoosen ash--text";
      }
      document.getElementsByClassName("office_options")[i].className =
        "office_options";
      this.selected = i;
    },
    getVitaboxes() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox")
        .then(response => {
          this.vitaboxes = response.data.vitaboxes;
           if (response.data.vitaboxes.length > 0)
            this.selectedVitabox(response.data.vitaboxes[0]);
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
  /* color: yellow !important; */
  background-color: #5b5b5b !important;
}

.vitaboxDivider {
  /* color: yellow !important; */
  background-color: white !important;
}
</style>


