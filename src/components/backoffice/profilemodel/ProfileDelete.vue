<template>
  <v-card id="delete_profile">
    <v-card-title>
      <span class="headline error--text">Delete Profile</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text  v-if="item">Are you sure you want to delete the "{{item.name}}" profile?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer><v-btn dark color="error darken-1" @click.native="deleteItem">PROCEED</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "delete_profile",
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    deleteItem() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .delete("/profilemodel/" + this.item.id)
        .then(response => {
          this.$emit("delete");
          event_bus.$emit("toast", {
            message: "profile was successfully removed",
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
    }
  }
};
</script>