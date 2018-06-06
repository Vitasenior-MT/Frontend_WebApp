<template>
  <v-content style="margin-top:20px">
    <v-tabs dark color="grey" grow v-model="vitabox" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left">
      <v-tab v-for="item in vitaboxes" :key="item.id" :href="`#tab-` + item">
        Vitabox - {{ item.address }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="vitabox">
      <v-tab-item lazy v-for="item in vitaboxes" :key="item.id" :id="`tab-` + item" >
        <vitaboxDashboard :selectedVitabox="selectedVitabox(item)"></vitaboxDashboard>
      </v-tab-item>
    </v-tabs-items>
  </v-content>  
</template>


<script>
import VitaboxDashboard from './VitaboxDashboard.vue';
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      vitaboxes: [],
      vitabox: null
    };
  },
  components: {
    vitaboxDashboard: VitaboxDashboard
  },
  created() {
    this.getVitaboxes();
  },
  methods: {
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
    selectedVitabox(vitaboxData){
      this.$store.commit("setVitaboxData", vitaboxData); 
      return vitaboxData;
    }
  }
};
</script>

<style>

</style>
