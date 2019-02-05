<template>
  <div id="disable_patient">
    <v-tooltip bottom v-if="patient.active">
      <v-btn
        slot="activator"
        icon
        small
        color="transparent"
        @click.native="()=>dialog_disable_patient=true"
      >
        <v-icon>fas fa-play-circle</v-icon>
      </v-btn>
      <span>{{ $t("frontoffice.patient.active") }}</span>
    </v-tooltip>
    <v-tooltip bottom v-else>
      <v-btn
        slot="activator"
        icon
        small
        color="transparent"
        @click.native="()=>dialog_disable_patient=true"
      >
        <v-icon>fas fa-pause-circle</v-icon>
      </v-btn>
      <span
        v-if="!patient.weight && !patient.height"
      >{{ $t("frontoffice.patient.waiting") }}</span>
      <span v-else>{{ $t("frontoffice.patient.paused") }}</span>
    </v-tooltip>

    <v-dialog v-model="dialog_disable_patient" max-width="600px">
      <v-card v-if="patient">
        <v-card-title>
          <span class="headline warning--text">{{ $t("frontoffice.patient.switch_activity") }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_disable_patient=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="!patient.weight && !patient.height">
          <p>{{ $t("frontoffice.patient.switch_info") }}</p>
          <v-layout wrap class="px-2">
            <v-flex xs12>
              <v-text-field
                :rules="[() => weight > 30 && weight < 130 || 'invalid weight']"
                :label="$t('frontoffice.patient.weight')"
                type="number"
                v-model="weight"
                suffix="kg"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :rules="[() =>  height > 1 && height < 2.2 || 'invalid height']"
                :label="$t('frontoffice.patient.height')"
                type="number"
                v-model="height"
                suffix="meters"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text v-else>{{ $t("frontoffice.patient.switch_confirm") }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="warning darken-1" block @click.native="switchActivity">{{ $t("frontoffice.patient.submit") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "disable_patient",
  props: {
    box: Object,
    patient: Object
  },
  data: () => {
    return {
      dialog_disable_patient: false,
      weight: 0,
      height: 0
    };
  },
  methods: {
    switchActivity() {
      if (this.patient.weight && this.patient.height)
        this.sendToServer({ patient_id: this.patient.id });
      else if (this.weight && this.height)
        this.sendToServer({
          patient_id: this.patient.id,
          weight: this.weight,
          height: this.height
        });
      else
        event_bus.$emit("toast", {
          message: "weight and height must be defined to activate the patient",
          type: "error"
        });
    },
    sendToServer(obj) {
      this.dialog_disable_patient = false;
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .put(
          "/vitabox/" +
            this.box.id +
            "/patient/" +
            (this.patient.active ? "disable" : "enable"),
          obj
        )
        .then(response => {
          this.patient.active = !this.patient.active;
          this.patient.height = this.patient.height
            ? this.patient.height
            : this.height;
          this.patient.weight = this.patient.weight
            ? this.patient.weight
            : this.weight;

          event_bus.$emit("toast", {
            message: "patient status was successfully changed",
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
    }
  }
};
</script>