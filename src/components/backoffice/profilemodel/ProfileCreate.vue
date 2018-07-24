<template>
  <v-dialog id="create_profile" v-model="dialog_create_profile" max-width="500px">
    <v-btn color="primary" dark slot="activator" class="mb-2">Create new profile model</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline primary_d--text">Add profile</span>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="()=>dialog_create_profile=false">
          <v-icon color="error">fas fa-times</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-text-field :rules="[() => profile.name!=='' || 'Name is required']" label="Name" v-model="profile.name"></v-text-field>
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
  name: "create_profile",
  data: () => {
    return {
      profile: {
        id: "",
        name: "",
        measures: []
      },
      dialog_create_profile: false
    };
  },
  methods: {
    save() {
      if (this.name !== "") {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/profilemodel", this.profile)
          .then(response => {
            this.profile.id = response.data.id;
            this.dialog_create_profile = false;
            this.$emit("new", this.profile);
            event_bus.$emit("toast", {
              message: "profile was successfully created",
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
