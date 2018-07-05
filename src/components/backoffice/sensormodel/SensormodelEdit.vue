<template>
  <v-card id="edit_sensor">
    <v-card-title>
      <span class="headline primary_d--text">Edit sensor</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="item">
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field :rules="[() => item.transducer.length > 3 || 'Transducer name is required']" label="Transducer name" v-model="item.transducer"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select :rules="[() => selected_measure !== null || 'Measure unit is required']" :items="items" item-text="measure" label="Measure unit" v-model="selected_measure" single-line append-icon="fas fa-angle-down"></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Minimum acceptable" v-model="item.min_acceptable"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field :rules="[() => item.min_acceptable < item.max_acceptable || 'Maximum acceptable must be greater Minimum acceptable']" label="Maximum acceptable" v-model="item.max_acceptable"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Minimum possible" v-model="item.min_possible"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field :rules="[() => item.min_possible < item.max_possible || 'Maximum possible must be greater Minimum possible ']" label="Maximum possible" v-model="item.max_possible"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="ash" dark @click.native="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "edit_sensor",
  data: () => {
    return {
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
      selected_measure: null
    };
  },
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      if (
        this.item.min_acceptable < this.item.max_acceptable &&
        this.item.min_possible < this.item.max_possible &&
        this.item.transducer !== "" &&
        this.selected_measure !== null
      ) {
        event_bus.$emit("waiting", true);
        this.item.tag = this.selected_measure.tag;
        this.item.measure = this.selected_measure.measure;
        this.item.unit = this.selected_measure.unit;
        event_bus.$data.http
          .put("/sensormodel/" + this.item.id, this.item)
          .then(response => {
            this.$emit("update", this.item);
            event_bus.$emit("toast", {
              message: "transducer was successfully updated",
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
          message: "fields should not be empty",
          type: "error"
        });
      }
    }
  }
};
</script>