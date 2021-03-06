<template>
  <v-card id="edit_sensor" v-if="item">
    <v-card-title>
      <span class="headline primary_d--text">Edit sensor - "{{item.measure}}"</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="pt-1">
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              :rules="[() => item.measure.length > 1 || 'Measure is required']"
              label="Measure (application presentation)"
              v-model="item.measure"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              :rules="[() => item.to_read.length > 5 || 'Measure text is required']"
              label="Measure (text-to-speech)"
              v-model="item.to_read"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm8>
            <v-text-field
              :rules="[() => item.tag.length > 3 || 'Measure tag is required']"
              label="Tag (system tag to measure)"
              v-model="item.tag"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm4>
            <v-text-field label="Measure Unit" v-model="item.unit"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              :rules="[() => item.transducer.length > 3 || 'Transducer name is required']"
              label="Transducer name"
              v-model="item.transducer"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Minimum acceptable" v-model="item.min_acceptable"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              :rules="[() => item.min_acceptable < item.max_acceptable || 'Maximum acceptable must be greater Minimum acceptable']"
              label="Maximum acceptable"
              v-model="item.max_acceptable"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Minimum possible" v-model="item.min_possible"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              :rules="[() => item.min_possible < item.max_possible || 'Maximum possible must be greater Minimum possible ']"
              label="Maximum possible"
              v-model="item.max_possible"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field label="Minimum to graph" v-model="item.min_graph"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              :rules="[() => item.min_graph < item.max_graph || 'Maximum value must be greater than Minimum value ']"
              label="Maximum to graph"
              v-model="item.max_graph"
            ></v-text-field>
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
        this.item.min_graph < this.item.max_graph &&
        this.item.transducer !== "" &&
        this.item.measure !== "" &&
        this.item.to_read !== "" &&
        this.item.tag !== ""
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