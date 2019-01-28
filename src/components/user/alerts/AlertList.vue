<template>
  <v-content>
    <v-toolbar color="primary" dark>
      <v-toolbar-items>
        <v-btn flat @click.native="setPage(-1)" :disabled="page==1"><v-icon>fas fa-angle-double-left</v-icon></v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-xs-center mx-0">
        <v-icon>fas fa-exclamation-triangle</v-icon>
        <p class="mb-0 subheading">Warnings</p>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="hasmore">
        <v-btn flat @click.native="setPage(1)" :disabled="!hasmore"><v-icon>fas fa-angle-double-right</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-list dark three-line>
      <v-layout class="warningSelector" v-for="(item, index) in warnings" :key="index" wrap>
        <v-flex xs12 class="text-md-left pa-0">
          <v-divider class="vitaboxDivider"></v-divider>
        </v-flex>
          <v-flex xs12 class="text-md-left">
            <v-layout v-if="item.entity" row wrap class="notificationInfo px-3 pt-1">
              <v-flex xs2 sm1 class="text-xs-center">
                <v-icon v-if="item.patient_id" class="primary_d--text px-1">fa fa-hand-holding-heart</v-icon>
                <v-icon v-else class="primary_d--text px-1">fa fa-tv</v-icon>
              </v-flex>
              <v-flex xs10 sm5>
                <label class="caption primary_l--text">To: </label>
                <label class="ash_l--text">{{item.entity}}</label>
              </v-flex>
              <v-flex xs2 sm1 class="text-xs-center">
                <v-icon class="primary_d--text px-1 pt-1">fa fa-calendar</v-icon>
              </v-flex>
              <v-flex xs10 sm5>
                <label class="caption primary_l--text">Sent: </label>  
                <label class="ash_l--text">{{  new Date(item.datetime).toLocaleDateString("pt-pt", options) }}</label>
                <br />
                <label class="caption primary_l--text">Seen: </label>  
                <label class="ash_l--text">{{  item.seen_vitabox?new Date(item.seen_vitabox).toLocaleDateString("pt-pt", options):"not seen" }}</label>
              </v-flex>
            </v-layout>

            <v-layout v-else row wrap class="notificationInfo px-3 pt-1">
              <v-flex xs2 sm1 class="text-xs-center">
                <v-icon class="primary_d--text px-1">fa fa-calendar</v-icon>
              </v-flex>
              <v-flex xs10 sm5>
                <label class="caption primary_l--text">Sent: </label>  
                <label class="ash_l--text">{{  new Date(item.datetime).toLocaleDateString("pt-pt", options) }}</label>
              </v-flex>
              <v-flex xs10 offset-xs2 offset-sm0 sm6>
                <label class="caption primary_l--text">Seen: </label>  
                <label class="ash_l--text">{{  item.seen_vitabox?new Date(item.seen_vitabox).toLocaleDateString("pt-pt", options):"not seen" }}</label>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="notificationMessage px-3 pb-3 pt-1">
              <v-flex xs2 sm1 class="text-xs-center">
                <span class="primary_l--text caption">Message: </span>
              </v-flex>
              <v-flex xs10 sm11>
                <span class="subheading white--text">{{ item.message }}</span>
              </v-flex>
            </v-layout>
        </v-flex>
        <v-flex xs12 class="text-md-left pa-0">
          <v-divider class="vitaboxDivider"></v-divider>
        </v-flex>
      </v-layout>  
    </v-list>

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
      hasmore: false
    };
  },
  created() {
    this.getWarnings();
  },
  methods: {
    getWarnings() {
      event_bus.$emit("waiting", true);
      this.warnings = [];
      event_bus.$data.http
        .get("/warning/" + this.page)
        .then(response => {
          this.warnings = response.data.warnings;
          event_bus.$emit("waiting", false);
          if (this.warnings.length == 25) this.hasmore = true;
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
    setPage(shift) {
      this.page = this.page + shift;
      this.getWarnings();
    }
  }
};
</script>

<style>
.warningSelector {
  padding-bottom: 0px;
}

.warningSelector:hover .warningMessage,
.warningSelector:hover .warningDate {
  background-color: #5b5b5b !important;
}
</style>