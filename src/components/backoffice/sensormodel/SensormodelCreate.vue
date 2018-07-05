<template>
  <v-dialog id="create_sensor" v-model="dialog_create_sensor" max-width="500px">
    <v-btn color="primary" dark slot="activator" class="mb-2">Create new sensor model</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline primary_d--text">Add sensor</span>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="()=>dialog_create_sensor=false">
          <v-icon color="error">fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field :rules="[() => sensor.transducer.length > 3 || 'Transducer name is required']" label="Transducer name" v-model="sensor.transducer"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select :rules="[() => selected_measure !== null || 'Measure unit is required']" :items="items" item-text="measure" label="Measure unit" v-model="selected_measure" single-line append-icon="fas fa-angle-down"></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Minimum acceptable" v-model="sensor.min_acceptable"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field :rules="[() => sensor.min_acceptable < sensor.max_acceptable || 'Maximum acceptable must be greater Minimum acceptable']" label="Maximum acceptable" v-model="sensor.max_acceptable"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Minimum possible" v-model="sensor.min_possible"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field :rules="[() => sensor.min_possible < sensor.max_possible || 'Maximum possible must be greater Minimum possible ']" label="Maximum possible" v-model="sensor.max_possible"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark color="ash" @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "create_sensor",
  data: () => {
    return {
      sensor: {
        id: "",
        transducer: "",
        measure: "",
        min_acceptable: 0,
        max_acceptable: 1,
        min_possible: 0,
        max_possible: 1,
        tag: "",
        unit: ""
      },
      items: [
        { measure: "temperatura", tag: "temp", unit: "ºC" },
        { measure: "humidade", tag: "humi", unit: "%" },
        { measure: "dióxido de carbon", tag: "dioxi", unit: "ppm" },
        { measure: "monóxido de carbono", tag: "mono", unit: "ppm" },
        {
          measure: "pressão arterial sistólica",
          tag: "systolic",
          unit: "mmHg"
        },
        {
          measure: "pressão arterial diastólica",
          tag: "diastolic",
          unit: "mmHg"
        },
        { measure: "pulsação arterial", tag: "pulse", unit: "bpm" },
        { measure: "oximetria do pulso", tag: "spo2", unit: "%" },
        { measure: "peso", tag: "weight", unit: "Kg" },
        { measure: "gordura corporal", tag: "bodyfat", unit: "%" },
        { measure: "massa óssea", tag: "bonemass", unit: "%" },
        { measure: "massa muscular", tag: "musclemass", unit: "%" },
        { measure: "gordura visceral", tag: "visceralfat", unit: "%" },
        { measure: "água", tag: "water", unit: "%" },
        { measure: "calorias", tag: "callories", unit: "%" },
        { measure: "passos", tag: "steps", unit: "" },
        { measure: "metros", tag: "meters", unit: "m" },
        { measure: "frequência cardíaca", tag: "heartrate", unit: "bpm" },
        { measure: "temperatura corporal", tag: "bodytemp", unit: "ºC" }
      ],
      selected_measure: null,
      dialog_create_sensor: false
    };
  },
  methods: {
    save() {
      if (
        this.sensor.min_acceptable < this.sensor.max_acceptable &&
        this.sensor.min_possible < this.sensor.max_possible &&
        this.sensor.transducer !== "" &&
        this.selected_measure !== null
      ) {
        event_bus.$emit("waiting", true);
        this.sensor.tag = this.selected_measure.tag;
        this.sensor.measure = this.selected_measure.measure;
        this.sensor.unit = this.selected_measure.unit;
        event_bus.$data.http
          .post("/sensormodel", this.sensor)
          .then(response => {
            this.sensor.id = response.data.id;
            this.dialog_create_sensor = false;
            this.$emit("new", this.sensor);
            event_bus.$emit("toast", {
              message: "transducer was successfully created",
              type: "errsuccessor"
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
          message: "insert all fields",
          type: "error"
        });
      }
    }
  }
};
</script>
