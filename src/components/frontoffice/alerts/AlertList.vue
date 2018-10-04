<template>
  <v-content>
    <v-tabs centered color="primary" dark icons-and-text>
      <v-tabs-slider color="white"></v-tabs-slider>
      <v-tab href="#tab-1">Warnings <v-icon>fas fa-exclamation-triangle</v-icon></v-tab>
      <v-tab-item id="tab-1">
        <v-list dark three-line>
          <v-layout class="warningSelector" v-for="(item, index) in warnings" :key="index" wrap>
            <v-flex xs12 class="text-md-left pa-0">
              <v-divider class="vitaboxDivider"></v-divider>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6 sl6 class="text-md-left pa-0">
              <v-card class="warningMessage" dark width="100%">
                <v-layout row>
                  <v-icon class="primary_d--text pt-0 pl-4">fa fa-exclamation-triangle</v-icon>
                  <h4 class="pa-3">
                    <span class="primary_l--text">Message:</span>
                    <h5>
                      <span>{{ item.message }}</span>
                    </h5>
                  </h4>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6 sl6 class="text-md-left pa-0">
              <v-card class="warningDate" dark width="100%" height="100%">
                <v-layout row>
                  <v-icon class="primary_d--text pt-0 pl-4">fa fa-calendar</v-icon>
                  <h4 class="pa-3">
                    <span class="primary_l--text">Date:</span>
                    <h5>
                      <span>{{  new Date(item.datetime).toLocaleDateString("pt-pt", options) }}</span>
                    </h5>
                  </h4>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12 class="text-md-left pa-0">
              <v-divider class="vitaboxDivider"></v-divider>
            </v-flex>
          </v-layout>  
        </v-list>
      </v-tab-item>
    </v-tabs>
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
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      },
      warnings: [],
      page: 1,
      currentPage: 0,
      itemsPerPage: 10,
      resultCount: 0
    };
  },
  computed: {
    totalPages: function() {
      console.log(
        Math.ceil(this.resultCount / this.itemsPerPage) + "totalPages"
      );
      return Math.ceil(this.resultCount / this.itemsPerPage);
    }
  },
  created() {
    this.getWarnings();
  },
  methods: {
    getWarnings() {
      event_bus.$emit("waiting", true);
      this.warnings = [];
      event_bus.$data.http
        .get("/warning")
        .then(response => {
          this.warnings = response.data.warnings;
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

<style>
.warningSelector {
  padding-bottom: 0px;
}

.warningSelector:hover .warningMessage {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.warningSelector:hover .warningDate {
  cursor: pointer;
  background-color: #5b5b5b !important;
}
</style>