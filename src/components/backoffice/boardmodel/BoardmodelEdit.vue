<template>
  <v-card id="edit_model">
    <v-card-title>
      <span class="headline primary_d--text">Edit board model</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text v-if="item">
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field :rules="[() => item.name.length > 3 || 'Name is required']" label="Name" v-model="item.name"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field :rules="[() => ['wearable', 'non-wearable', 'environmental'].includes(item.type) || 'Type must be environmental, wearable or non-wearable']" label="Type (wearable, non-wearable, environmental)" v-model="item.type"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field :rules="[() => item.tag.length > 3 || 'Tag is required']" label="Tag (system tag to board)" v-model="item.tag"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn dark color="ash" @click.native="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "edit_model",
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      if (this.item.name !== "" && this.item.type !== "" && this.item.tag !== "") {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .put("/boardmodel/" + this.item.id, this.item)
          .then(response => {
            this.$emit("update", this.item);
            event_bus.$emit("toast", {
              message: "board model was successfully updated",
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