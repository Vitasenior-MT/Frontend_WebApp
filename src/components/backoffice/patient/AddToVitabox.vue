<template>
  <v-expansion-panel id="add_patient_to_box" inset>
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary" dark><v-icon>fas fa-user-plus</v-icon></v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs8 sm9>
              <v-text-field :rules="[() => patient.name.length > 3 || 'Patient name is required']" label="Name" v-model="patient.name"></v-text-field>
            </v-flex>
            <v-flex xs4 sm3>
              <v-text-field :rules="[() => patient.height > 0.5 && patient.height < 3 || 'Invalid patient height value']" label="Height" v-model="patient.height" type="number" step="0.01" suffix="m"></v-text-field>
            </v-flex>
            <v-flex xs4 sm3>
              <v-text-field :rules="[() => patient.weight > 20 && patient.weight < 120 || 'Invalid patient weight value']" label="Weight" v-model="patient.weight" type="number" step="0.01" suffix="kg"></v-text-field>
            </v-flex>
            <v-flex xs6 sm5>
              <v-select :rules="[() => patient.gender.length > 1 || 'Patient gender is required']" :items="items" label="Gender" v-model="patient.gender" single-line append-icon="fas fa-angle-down"></v-select>
            </v-flex>
            <v-flex xs4 sm3>
              <v-text-field :rules="[() => patient.weight > 35 && patient.weight < 300 || 'Invalid patient weight value']" label="Weight" v-model="patient.weight" type="number" step="0.1" suffix="m"></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="patient.birthdate">
                <v-text-field slot="activator" :rules="[() => patient.birthdate !== null || 'Patient birthdate is required']" label="Birthdate" v-model="patient.birthdate" append-icon="fas fa-calendar-alt" readonly></v-text-field>
                <v-date-picker ref="picker" v-model="patient.birthdate" @change="$refs.menu.save(patient.birthdate)" min="1910-01-01" :max="new Date().toISOString().substr(0, 10)" no-title next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex sx4 offset-xs8 sm2 offset-sm4>
              <div class="text-xs-right mt-3">
                <v-btn dark color="ash" block @click.native="save">Save</v-btn>
              </div>
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
        id: null
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
        this.patient.birthdate !== null
      ) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/vitabox/" + this.box.id + "/patient", this.patient)
          .then(response => {
            this.patient.id = response.data.id;
            this.$emit("update", this.patient);
            event_bus.$emit("toast", {
              message: "patient was successfully added to vitabox",
              type: "success"
            });
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