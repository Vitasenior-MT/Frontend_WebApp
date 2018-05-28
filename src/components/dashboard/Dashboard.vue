<template>
  <v-container style="margin-top:35px">
    <v-tabs dark color="grey" grow v-model="vitabox" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left">
      <v-tab v-for="item in vitaboxes" :key="item.id" :href="`#tab-${item.id}`">
        Vitabox - {{ item.address }}
      </v-tab>
    </v-tabs>
      <v-tabs-items v-model="vitabox">
        <vitaboxDashboard v-for="item in vitaboxes" :key="item.id" :id="`tab-${item.id}`" lazy :selectedVitabox="item"></vitaboxDashboard>
      </v-tabs-items>
  </v-container>  
</template>


<script>
import VitaboxDashboard from '@/components/dashboard/VitaboxDashboard.vue';
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
    }
  }
};
</script>

<style>

</style>
