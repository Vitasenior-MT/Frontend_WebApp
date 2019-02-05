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
            <v-flex xs12>
              <v-text-field
                :rules="[() => sensor.measure.length > 1 || 'Measure is required']"
                label="Measure (application presentation)"
                v-model="sensor.measure"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :rules="[() => sensor.to_read.length > 5 || 'Measure text is required']"
                label="Measure (text-to-speech)"
                v-model="sensor.to_read"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm8>
              <v-text-field
                :rules="[() => sensor.tag.length > 3 || 'Measure tag is required']"
                label="Tag (system tag to measure)"
                v-model="sensor.tag"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field label="Measure Unit" v-model="sensor.unit"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                :rules="[() => sensor.transducer.length > 3 || 'Transducer name is required']"
                label="Transducer name"
                v-model="sensor.transducer"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Minimum acceptable" v-model="sensor.min_acceptable"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                :rules="[() => sensor.min_acceptable < sensor.max_acceptable || 'Maximum acceptable must be greater than Minimum acceptable']"
                label="Maximum acceptable"
                v-model="sensor.max_acceptable"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Minimum possible" v-model="sensor.min_possible"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                :rules="[() => sensor.min_possible < sensor.max_possible || 'Maximum possible must be greater than Minimum possible ']"
                label="Maximum possible"
                v-model="sensor.max_possible"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Minimum to graph" v-model="sensor.min_graph"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                :rules="[() => sensor.min_graph < sensor.max_graph || 'Maximum value must be greater than Minimum possible ']"
                label="Maximum to graph"
                v-model="sensor.max_graph"
              ></v-text-field>
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
        min_graph: 0,
        max_graph: 1,
        tag: "",
        unit: "",
        to_read: ""
      },
      selected_measure: null,
      dialog_create_sensor: false
    };
  },
  methods: {
    save() {
      if (
        this.sensor.min_acceptable < this.sensor.max_acceptable &&
        this.sensor.min_possible < this.sensor.max_possible &&
        this.sensor.min_graph < this.sensor.max_graph &&
        this.sensor.transducer !== "" &&
        this.sensor.measure !== "" &&
        this.sensor.to_read !== "" &&
        this.sensor.tag !== ""
      ) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/sensormodel", this.sensor)
          .then(response => {
            this.sensor.id = response.data.id;
            this.dialog_create_sensor = false;
            this.$emit("new", this.sensor);
            event_bus.$emit("toast", {
              message: "transducer was successfully created",
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
