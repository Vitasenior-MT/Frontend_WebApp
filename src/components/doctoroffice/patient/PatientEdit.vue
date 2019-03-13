<template>
  <div id="edit_model">
    <v-tooltip left>
      <v-btn slot="activator" icon @click.native="()=>dialog_edit_patient=true">
        <v-icon color="teal">fas fa-edit</v-icon>
      </v-btn>
      <span>{{$t('frontoffice.patient.edit_bydoctor_tooltip')}}</span>
    </v-tooltip>
    <v-dialog v-model="dialog_edit_patient" width="500">
      <v-card>
        <v-card-title>
          <span class="headline primary_d--text">{{$t('frontoffice.patient.edit_bydoctor_title')}}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_edit_patient=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="patient">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  :rules="[() => parseFloat(patient.weight) > 30 && parseFloat(patient.weight) < 130 || 'invalid weight']"
                  :label="$t('frontoffice.patient.weight')"
                  type="number"
                  v-model="patient.weight"
                  suffix="kg"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :rules="[() => parseFloat(patient.height) > 1 && parseFloat(patient.height) < 2.2 || 'invalid height']"
                  :label="$t('frontoffice.patient.height')"
                  type="number"
                  v-model="patient.height"
                  suffix="m"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-0">
                <v-chip v-for="(med, i) in patient.medication" :key="i">
                  {{med}}&nbsp;
                  <v-icon @click="removeMedicine(i)">fas fa-times</v-icon>
                </v-chip>
              </v-flex>
              <v-flex xs10>
                <v-text-field :label="$t('frontoffice.patient.medication')" v-model="medicine"></v-text-field>
              </v-flex>
              <v-flex xs2 class="text-xs-right">
                <v-btn icon @click="addMedicine">
                  <v-icon>fas fa-plus</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-textarea :label="$t('frontoffice.patient.info')" v-model="patient.info"></v-textarea>
                <!-- <v-text-field :label="$t('frontoffice.patient.info')" v-model="patient.info"></v-text-field> -->
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="ash" @click.native="save">{{$t('frontoffice.patient.save')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "edit_model",
  props: {
    patient: Object
  },
  data: () => {
    return {
      dialog_edit_patient: false,
      medicine: ""
    };
  },
  mounted() {
    this.patient = this.$store.state.patient;
  },
  methods: {
    save() {
      if (this.patient.height && this.patient.weight) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .put("/patient/" + this.patient.id + "/biometric", {
            height: this.patient.height,
            weight: this.patient.weight,
            info: this.patient.info ? this.patient.info : "",
            medication: this.patient.medication ? this.patient.medication : []
          })
          .then(response => {
            this.$store.commit("setPatientData", this.patient);
            event_bus.$emit("update_patient", this.patient);
            event_bus.$emit("toast", {
              message: "patient profile was successfully updated",
              type: "success"
            });
            this.dialog_edit_patient = false;
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
    },
    addMedicine() {
      if (!this.patient.medication) this.patient.medication = [this.medicine];
      else this.patient.medication.push(this.medicine);
      this.medicine = "";
    },
    removeMedicine(i) {
      this.patient.medication.splice(i, 1);
    }
  }
};
</script>