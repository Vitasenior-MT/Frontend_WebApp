<template>
  <v-content>
    <v-toolbar color="primary" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-xs-center mx-0">
        <v-icon>fas fa-inbox</v-icon>
        <p class="mb-0 subheading">{{ $t('doctor.requests') }}</p>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-list three-line v-if="requests.length>0">
      <template v-for="(item, index) in requests">
        <v-list-tile :key="index" avatar ripple @click="()=>{}">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.patient }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ formatDate(item.created_at) }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn icon @click.native="responseToRequest(false, item.patient_id)">
              <v-icon color="red" small>fas fa-times</v-icon>
            </v-btn>
            <v-btn dark icon color="green" @click.native="responseToRequest(true, item.patient_id)">
              <v-icon>fas fa-check</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
    <v-alert
      :value="requests.length<1"
      type="info"
      icon="fas fa-info-circle"
    >{{$t('doctor.no_request')}}</v-alert>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      requests: []
    };
  },
  mounted() {
    this.getRequests();
  },
  methods: {
    getRequests() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/doctor/request/list")
        .then(response => {
          this.requests = response.data.requests;
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
    responseToRequest(flag, patient) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .put("/patient/" + patient + "/doctor", { accept: flag })
        .then(response => {
          this.requests.splice(
            this.requests.map(x => x.patient_id).indexOf(patient),
            1
          );
          event_bus.$emit("new_patient");
          event_bus.$emit("toast", {
            message: "patient request accepted",
            type: "success"
          });
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
    formatDate(date) {
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let d = new Date(date);
      return (
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds() +
        " - " +
        d.getDate() +
        " " +
        monthNames[d.getMonth()] +
        " " +
        d.getFullYear()
      );
    }
  }
};
</script>


