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
          <label class="align-vertical-center">{{ $t('user.notification.new_warnings') }}: <span class="subheading font-weight-bold">{{new_warnings}}</span></label>
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
        <alert-environment-list></alert-environment-list>
      </v-tab-item>
      <v-tab-item value="tab-pat">
        <alert-patient-list></alert-patient-list>
      </v-tab-item>
    </v-tabs>
    <div v-else>
      <alert-patient-list></alert-patient-list>
    </div>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import AlertEnvironmentList from "@/components/user/alerts/AlertEnvironmentList";
import AlertPatientList from "@/components/user/alerts/AlertPatientList";

export default {
  data() {
    return {
      active_tab: "tab-pat",
      new_warnings: 0
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
  components: {
    "alert-patient-list": AlertPatientList,
    "alert-environment-list": AlertEnvironmentList
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
</style>