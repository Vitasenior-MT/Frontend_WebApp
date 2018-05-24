<template>
    <div>
        <p>The Vitabox Home Page</p>
        <v-list>
        <v-list-tile v-for="item in vitaboxes" :key="item.id">
          <v-list-tile-content>id: {{ item.id }}</v-list-tile-content>
          <v-list-tile-content>address: {{ item.address }}</v-list-tile-content>
          <v-list-tile-content>registered: {{ item.registered }}</v-list-tile-content>
          <v-list-tile-content>active: {{ item.active }}</v-list-tile-content>
          <v-list-tile-content> 
              <v-btn @click='goToVitaboxDetails(item)'>
                <v-icon >mdi-information-outline</v-icon>
              </v-btn>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <a @click="$router.go(-1)">back</a>
    </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      vitaboxes: [],
    };
  },
  created() {
    this.getVitaboxes();
  },
  methods: {
    getVitaboxes() {
      event_bus.$data.http.get("/vitabox").then(response => {
        this.vitaboxes = response.data.vitaboxes;
      });
    },
    goToVitaboxDetails(vitaboxData) {
      this.$store.commit("setVitaboxData", vitaboxData);
      this.$router.push("/vitabox/detail");
    }
  }
};
</script>