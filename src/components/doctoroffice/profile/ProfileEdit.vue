<template>
  <v-card id="edit_profile">
    <v-card-title>
      <span class="headline primary_d--text">Edit profile</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="item">
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field label="Minimum acceptable" v-model="item.min" type="number"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field :rules="[() => parseFloat(item.min) < parseFloat(item.max) || 'Maximum must be greater than Minimum']" label="Maximum acceptable" v-model="item.max" type="number"></v-text-field>
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
  name: "edit_profile",
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      if (parseFloat(this.item.max) > parseFloat(this.item.min)) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .put(
            "/patient/" +
              this.$store.state.patient.id +
              "/profile/" +
              this.item.id,
            { min: this.item.min, max: this.item.max }
          )
          .then(response => {
            this.$store.commit("setProfileData", this.item);

            event_bus.$emit("toast", {
              message: "profile was successfully updated",
              type: "success"
            });
            this.close();
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
    }
  }
};
</script>