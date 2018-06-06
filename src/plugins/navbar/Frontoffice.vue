<template>
  <v-list id="frontoffice" class="office_menu">
    <router-link v-for='(link,index) in links.frontoffice' :key='link.name + index' :to='link.path'>
      <v-list-tile class="office_options office_notchoosen ash--text">
        <v-list-tile-action>
          <v-icon v-if="link.icon">{{link.icon}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="link.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <v-list v-for="item in vitaboxes" :key="item.id" :selectedVitabox="selectedVitabox(item)">
      <v-list-tile class="office_options office_notchoosen ash--text">
        <v-list-tile-action>
          <v-icon>fa fa-tv</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title > Vitabox - {{ item.address }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
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
      event_bus.$data.http
        .get("/vitabox")
        .then(response => {
          this.vitaboxes = response.data.vitaboxes;
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
        });
    },
    selectedVitabox(vitaboxData) {
      this.$store.commit("setVitaboxData", vitaboxData);
      return vitaboxData;
    }
  }
};
</script>



