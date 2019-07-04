<template>
  <v-card id="edit_profile" v-if="item">
    <v-card-title>
      <span
        class="headline primary_d--text"
      >{{$t('frontoffice.patient.edit_profile')}}: {{item.measure}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field
              :label="$t('frontoffice.patient.minimum_acceptable_day')"
              v-model="item.min_diurnal"
              type="number"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              :rules="[() => parseFloat(item.min_diurnal) < parseFloat(item.max_diurnal) || 'Maximum must be greater than Minimum']"
              :label="$t('frontoffice.patient.maximum_acceptable_day')"
              v-model="item.max_diurnal"
              type="number"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              :label="$t('frontoffice.patient.minimum_acceptable_night')"
              v-model="item.min_nightly"
              type="number"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              :rules="[() => parseFloat(item.min_nightly) < parseFloat(item.max_nightly) || 'Maximum must be greater than Minimum']"
              :label="$t('frontoffice.patient.maximum_acceptable_night')"
              v-model="item.max_nightly"
              type="number"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="ash" dark @click.native="save">{{$t('frontoffice.patient.save')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "edit_profile",
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      if (
        parseFloat(this.item.max_diurnal) > parseFloat(this.item.min_diurnal) &&
        parseFloat(this.item.max_nightly) > parseFloat(this.item.min_nightly)
      ) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .put("/patient/" + this.$store.state.patient.id + "/profile", {
            profiles: [
              {
                id: this.item.id,
                min_diurnal: this.item.min_diurnal,
                max_diurnal: this.item.max_diurnal,
                min_nightly: this.item.min_nightly,
                max_nightly: this.item.max_nightly
              }
            ],
            description: "Custom"
          })
          .then(response => {
            this.$store.commit("setProfileData", [
              {
                id: this.item.id,
                min_diurnal: this.item.min_diurnal,
                max_diurnal: this.item.max_diurnal,
                min_nightly: this.item.min_nightly,
                max_nightly: this.item.max_nightly
              }
            ]);
            let patient = this.$store.state.patient;
            patient.profile = "Custom";
            this.$store.commit("setPatientData", patient);
            event_bus.$emit("toast", {
              message: "profile was successfully updated",
              type: "success"
            });
            this.close();
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
      } else {
        event_bus.$emit("toast", {
          message: "fields should not be empty",
          type: "error"
        });
      }
    }
  }
};
</script>