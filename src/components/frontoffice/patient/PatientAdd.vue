<template>
  <v-expansion-panel id="add_patient_to_box" inset dark>
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary" dark><v-icon>fas fa-plus</v-icon></v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 lg3>
              <v-text-field :rules="[() => patient.name.length > 3 || 'Patient name is required']" label="Name" v-model="patient.name"></v-text-field>
            </v-flex>
            <v-flex xs12 md6 lg2>
              <v-select :rules="[() => patient.gender.length > 1 || 'Patient gender is required']" :items="items" label="Gender" v-model="patient.gender" single-line append-icon="fas fa-angle-down"></v-select>
            </v-flex>
            <v-flex xs12 md6 lg3>
              <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="patient.birthdate">
                <v-text-field slot="activator" :rules="[() => patient.birthdate !== null || 'Patient birthdate is required']" label="Birthdate" v-model="patient.birthdate" append-icon="fas fa-calendar-alt" readonly></v-text-field>
                <v-date-picker ref="picker" v-model="patient.birthdate" @change="$refs.menu.save(patient.birthdate)" min="1910-01-01" :max="new Date().toISOString().substr(0, 10)" no-title next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 md6 lg2>
              <v-text-field mask="#########" :rules="[() => patient.nif.length === 9 || 'Invalid Patient NIF']" label="NIF" v-model="patient.nif"></v-text-field>
            </v-flex>
            <v-flex xs12 md6 lg2>
              <v-text-field  :rules="[() => /^[0-9]{8}([ -]*[0-9][ ]*[A-Z]{2}[0-9])*$/.test(patient.cc) || 'Invalid Patient CC']" label="CC" v-model="patient.cc"></v-text-field>
            </v-flex>
            <v-flex sx12>
              <v-btn dark color="ash" block @click.native="save">Save</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "add_patient_to_box",
  props: {
    box: Object
  },
  data: () => {
    return {
      patient: {
        name: "",
        birthdate: null,
        gender: "",
        height: null,
        weight: null,
        id: null,
        since: null,
        active: false,
        nif: "",
        cc: ""
      },
      items: ["male", "female", "undefined"],
      menu: false
    };
  },
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  methods: {
    save() {
      if (
        this.patient.gender.length > 1 &&
        this.patient.name.length > 3 &&
        this.patient.birthdate !== null &&
        this.patient.nif.length === 9 &&
        this.patient.cc.length >= 8
      ) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/vitabox/" + this.box.id + "/patient", this.patient)
          .then(response => {
            this.patient.id = response.data.id;
            this.patient.since = new Date();
            this.$emit("addpatient", this.patient);
            event_bus.$emit("toast", {
              message: "patient was successfully added to vitabox",
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
      } else {
        event_bus.$emit("toast", {
          message: "insert all fields please",
          type: "error"
        });
      }
    }
  }
};
</script>