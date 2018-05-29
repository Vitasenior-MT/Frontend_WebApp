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
            <v-select :rules="[() => item.measure.length > 1 || 'Measure unit is required']" :items="items" label="Measure unit" v-model="item.measure" single-line append-icon="fas fa-angle-down"></v-select>
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
      items: ["temperature", "humidity", "monoxide carbon"]
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
        this.item.measure !== ""
      ) {
        event_bus.$emit("waiting", true);
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