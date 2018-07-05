<template>
   <v-expansion-panel id="create_measure" inset>
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary" dark><v-icon>fas fa-plus</v-icon></v-btn>
      </div>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 md6>
            <v-select :rules="[() => selected_measure !== null || 'Measure unit is required']" :items="items" item-text="measure" label="Measure unit" v-model="selected_measure" single-line append-icon="fas fa-angle-down"></v-select>
          </v-flex>
          <v-flex xs12 sm6 md2>
            <v-text-field label="Minimum acceptable" v-model="measure.min"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md2>
            <v-text-field :rules="[() => measure.min < measure.max || 'Maximum must be greater than Minimum']" label="Maximum acceptable" v-model="measure.max"></v-text-field>
          </v-flex>
          <v-flex xs12 md2>
            <v-btn dark color="ash" block @click.native="save">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "create_measure",
  props: {
    profile: Object
  },
  data: () => {
    return {
      measure: {
        id: "",
        measure: "",
        min: 0,
        max: 1,
        tag: ""
      },
      items: [
        { measure: "systolic", tag: "systolic" },
        { measure: "diastolic", tag: "diastolic" },
        { measure: "pulse", tag: "pulse" },
        { measure: "pulse oximetry", tag: "spo2" },
        { measure: "weight", tag: "weight" },
        { measure: "body fat", tag: "bodyfat" },
        { measure: "bone mass", tag: "bonemass" },
        { measure: "muscle mass", tag: "musclemass" },
        { measure: "visceral fat", tag: "visceralfat" },
        { measure: "water", tag: "water" },
        { measure: "calories", tag: "callories" },
        { measure: "steps", tag: "steps" },
        { measure: "meters", tag: "meters" },
        { measure: "heart rate", tag: "heartrate" },
        { measure: "body temperature", tag: "bodytemp" }
      ],
      selected_measure: null
    };
  },
  methods: {
    save() {
      if (
        this.measure.min < this.measure.max &&
        this.selected_measure !== null
      ) {
        event_bus.$emit("waiting", true);
        this.measure.tag = this.selected_measure.tag;
        this.measure.measure = this.selected_measure.measure;
        event_bus.$data.http
          .post("/profilemodel/" + this.profile.id + "/measure", this.measure)
          .then(response => {
            this.measure.id = response.data.id;
            this.$emit("new", this.measure);
            event_bus.$emit("toast", {
              message: "measure was successfully created",
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
          message: "insert all fields",
          type: "error"
        });
      }
    }
  }
};
</script>
