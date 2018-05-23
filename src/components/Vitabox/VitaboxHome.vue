<template>
    <div>
        <p>The Vitabox Home Page</p>
        <v-list>
        <v-list-tile v-for="item in results" :key="item.id">
          <v-list-tile-content>id: {{ item.id }}</v-list-tile-content>
          <v-list-tile-content>address: {{ item.address }}</v-list-tile-content>
          <v-list-tile-content>registered: {{ item.registered }}</v-list-tile-content>
          <v-list-tile-content>active: {{ item.active }}</v-list-tile-content>
          <v-list-tile-content> 
            <router-link :to="{name: 'VitaboxDetail', params: { box:item } }">
              <v-btn class="mb-3" success >
                <v-icon >mdi-information-outline</v-icon>
              </v-btn>
            </router-link>
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
      results: []
    };
  },
  created() {
    this.getVitaboxes();
  },
  methods: {
    getVitaboxes() {
      event_bus.$data.http.get("/vitabox").then(response => {
        this.results = response.data.vitaboxes;
      });
    }
  }
};
</script>