<template>
  <v-content >
    <v-layout wrap>
      <v-flex v-if="this.vitaboxwarnings.length > 0">
        <v-stepper vertical non-linear v-for="item in vitaboxwarnings" :key="item.id" >
          <v-stepper-step step="1" editable >Name of step 1</v-stepper-step>
          <v-stepper-content step="1">
            <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
            <v-btn color="primary" @click.native="e13 = 2">Continue</v-btn>
            <v-btn flat>Cancel</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-flex>
      <v-flex v-else>
        <v-card dark>
          <v-card-title primary class="title">There are no warnings!</v-card-title>
          <v-card-text primary> ---- </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-flex style="padding-bottom:20px; padding-top:10px;">
      <v-btn dark style="margin-left:0px;" @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <span style="padding-left:10px"> Go Back</span>
      </v-btn>
    </v-flex>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      e13: 2,
      vitaboxwarnings: [],
    };
  },
  created(){
    this.getVitaboxWarnings();
  },
  methods: {
    getVitaboxWarnings() {
      event_bus.$emit("waiting", true);
      this.vitaboxwarnings = [];
      event_bus.$data.http
        .get("/warning")
        .then(response => {
          this.vitaboxwarnings = response.data.warnings;
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
    }
  }
};
</script>