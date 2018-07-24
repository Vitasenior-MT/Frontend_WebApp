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
          <v-flex xs12>
            <v-text-field label="Name" v-model="item.name"></v-text-field>
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
      if (this.item.name !== "") {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .put("/profilemodel/" + this.item.id, { name: this.item.name })
          .then(response => {
            this.$emit("update", this.item);
            event_bus.$emit("toast", {
              message: "profile was successfully updated",
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