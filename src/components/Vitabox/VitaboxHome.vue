<template>
    <div>
        <p>The Vitabox Home Page</p>
        <v-list>
        <v-list-tile v-for="item in results" :key="item.id">
          <v-list-tile-content>id: {{ item.id }}</v-list-tile-content>
          <v-list-tile-content>latitude: {{ item.latitude }}</v-list-tile-content>
          <v-list-tile-content>longitude: {{ item.longitude }}</v-list-tile-content>
          <v-list-tile-content>address: {{ item.address }}</v-list-tile-content>
          <v-list-tile-content>sponsor: {{ item.sponsor }}</v-list-tile-content>
          <v-list-tile-content>registered: {{ item.registered }}</v-list-tile-content>
          <v-list-tile-content>active: {{ item.active }}</v-list-tile-content>
          <v-list-tile-content>created_at: {{ item.created_at }}</v-list-tile-content>
          <v-list-tile-content>updated_at: {{ item.updated_at }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>
</template>


<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      results: []
    };
  },
  mounted() {
    this.getVitaboxes("VitaboxHome");
  },
  methods: {
    getVitaboxes(section) {
      event_bus.$data.http.get("/vitabox").then(response => {
        this.results = response.data.vitaboxes;
      });
    }
  }
};
</script>