<template>
  <v-content>
    <v-spacer></v-spacer>
    <v-toolbar color="primary" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-xs-center mx-0">
        <v-icon>fas fa-exclamation-triangle</v-icon>
        <p class="mb-0 subheading">{{ $t('user.notification.warnings') }}</p>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <div style="position:relative;">
          <label class="align-vertical-center">
            {{ $t('user.notification.new_warnings') }}:
            <span
              class="subheading font-weight-bold"
            >{{new_warnings}}</span>
          </label>
        </div>
      </v-toolbar-items>
    </v-toolbar>

    <v-divider class="my-2"></v-divider>

    <v-tabs
      v-if="!$store.state.user.as_doctor"
      v-model="active_tab"
      dark
      centered
      slider-color="primary"
    >
      <v-tab ripple href="#tab-env">{{ $t('user.notification.environment') }}</v-tab>
      <v-tab ripple href="#tab-pat">{{ $t('user.notification.patients') }}</v-tab>

      <v-tab-item value="tab-env">
        <alert-environment-list @graph="obj=>showGraph(obj)"></alert-environment-list>
      </v-tab-item>
      <v-tab-item value="tab-pat">
        <alert-patient-list @graph="obj=>{showGraph(obj)}"></alert-patient-list>
      </v-tab-item>
    </v-tabs>
    <div v-else>
      <alert-patient-list v-on:graph="obj=>showGraph(obj)"></alert-patient-list>
    </div>

    <v-dialog v-model="graph_dialog" lazy width="800">
      <warning-graph
        @close="graph_dialog = false"
        :patient_id="patient_id"
        :sensor_id="sensor_id"
        :warning_date="warning_date"
      ></warning-graph>
    </v-dialog>

    <v-btn dark class="ml-0" @click="$router.go(-1)">
      <v-icon>fas fa-long-arrow-alt-left</v-icon>
      <span class="pl-1">{{$t('dashboard.back')}}</span>
    </v-btn>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import AlertEnvironmentList from "@/components/user/alerts/AlertEnvironmentList";
import AlertPatientList from "@/components/user/alerts/AlertPatientList";
import WarningGraph from "@/components/frontoffice/sensor/SensorWarning.vue";

export default {
  data() {
    return {
      active_tab: "tab-pat",
      new_warnings: 0,
      sensor_id: "",
      patient_id: "",
      warning_date: null,
      graph_dialog: false
    };
  },
  mounted() {
    this.new_warnings = this.$store.state.user.warnings;
    this.$store.commit("setUserWarningsErrors", 0);

    event_bus.$data.http
      .put("/warning")
      .then(response => {})
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
      });
  },
  methods: {
    showGraph(obj) {
      this.patient_id = obj.patient_id ? obj.patient_id : null;
      this.warning_date = obj.warning_date;
      this.sensor_id = obj.sensor_id;
      this.graph_dialog = true;
    }
  },
  components: {
    "alert-patient-list": AlertPatientList,
    "alert-environment-list": AlertEnvironmentList,
    "warning-graph": WarningGraph
  }
};
</script>

<style>
.warningSelector {
  padding-bottom: 0px;
}

.alert-text {
  height: 76px;
}

.v-tabs__item--active {
  font-weight: bold;
}
</style>