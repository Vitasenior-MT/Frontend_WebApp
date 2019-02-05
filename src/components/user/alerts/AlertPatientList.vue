<template>
  <div>
    <v-toolbar dense color="primary" dark>
      <v-toolbar-items>
        <v-btn flat @click.native="setPagePatient(1)" :disabled="!hasmore">
          <v-icon>fas fa-angle-double-left</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click.native="setPagePatient(-1)" :disabled="page==1">
          <v-icon>fas fa-angle-double-right</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-layout wrap>
      <v-flex sm6 md4 xl3 v-for="(item, index) in warnings" :key="index">
        <v-card class="ma-1" dark :color="item.color + ' darken-1'">
          <v-card-title class="pb-2" @click="goToSensorWarning(item)">
            <v-layout row>
              <v-flex xs2>
                <img :src="require('@/assets/'+item.tag+'_icon.svg')" style="width:40px !important">
              </v-flex>
              <v-flex xs10>
                <div class="pl-2">
                  <span class="title font-weight-light">{{item.entity}}</span>
                  <br>
                  <v-tooltip bottom>
                    <v-icon small slot="activator" color="black">fas fa-share-square</v-icon>
                    <span>{{ $t('user.notification.sent') }}</span>
                  </v-tooltip>
                  <label
                    class="ash_l--text"
                  >{{ new Date(item.datetime).toLocaleDateString("pt-pt", options) }}</label>
                  <br>
                  <v-tooltip bottom>
                    <v-icon small slot="activator" color="black">fas fa-eye</v-icon>
                    <span>{{ $t('user.notification.seen') }}</span>
                  </v-tooltip>
                  <label
                    class="ash_l--text"
                  >{{ item.seen_vitabox?new Date(item.seen_vitabox).toLocaleDateString("pt-pt", options):"not seen" }}</label>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text class="subheading pt-0 alert-text">
            <div class="align-vertical-center" style="position:relative;align-items: center;">
              <label>"{{ item.message }}"</label>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      options: {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      },
      warnings: [],
      page: 1,
      hasmore: false
    };
  },
  mounted() {
    if (this.$store.state.user.as_doctor) {
      this.getPatientWarnings("/warning/" + this.page);
    } else {
      this.getPatientWarnings("/warning/" + this.page + "/patient");
    }
  },
  methods: {
    setPagePatient(shift) {
      this.page = this.page + shift;
      if (this.$store.state.user.as_doctor) {
        this.getPatientWarnings("/warning/" + this.page);
      } else {
        this.getPatientWarnings("/warning/" + this.page + "/patient");
      }
    },
    getPatientWarnings(url) {
      event_bus.$emit("waiting", true);
      this.warnings = [];
      event_bus.$data.http
        .get(url)
        .then(response => {
          let colors = [
            "purple",
            "deep-purple",
            "indigo",
            "blue",
            "teal",
            "green",
            "lime",
            "amber"
          ];
          this.warnings = response.data.warnings;
          let uniquetags = [...new Set(this.warnings.map(item => item.tag))];
          this.warnings.map(
            item => (item.color = colors[uniquetags.indexOf(item.tag)])
          );
          if (this.warnings.length == 24) this.hasmores = true;
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", {
              message: error.message,
              type: "error"
            });
          }
          event_bus.$emit("waiting", false);
        });
    },
    goToSensorWarning(warning) {
      this.$router.push({
        name: "FOSensorWarning",
        params: {
          sensor_id: warning.sensor_id,
          patient_id: warning.patient_id,
          warning_date: new Date(warning.datetime)
        }
      });
    }
  }
};
</script>

<style>
</style>
