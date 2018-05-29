<template>
  <v-content id="chg_pwd" fluid fill-height>
    <v-layout align-center justify-center>
      <v-card  width="500">
        <v-card-text>
          <v-form>
              <v-text-field v-model="old_password" name="oldpwd" label="Old password" id="oldpwd" type="password"></v-text-field>
              <v-text-field v-model="new_password" name="newpwd" label="New password" id="newpwd" type="password" :rules="[() => new_password !== old_password || 'The new password must be different from old']"></v-text-field>
              <v-text-field v-model="confirmed_password" name="confpwd" label="Confirm new password" id="confpwd" type="password" :rules="[() => new_password === confirmed_password || 'The password don\'t match']"></v-text-field>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="save">Submit</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "chg_pwd",
  data: () => {
    return {
      old_password: "",
      new_password: "",
      confirmed_password: ""
    };
  },
  created: () => {},
  methods: {
    save() {
      if (this.new_password !== this.old_password) {
        if (this.new_password === this.confirmed_password) {
          event_bus.$emit("waiting", true);
          event_bus.$data.http
            .post("/chpass", {
              old_password: this.old_password,
              new_password: this.new_password
            })
            .then(response => {
              event_bus.$emit("toast", {
                message: "password successfully updated",
                type: "success"
              });
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
            message: "The password don't match",
            type: "error"
          });
        }
      } else {
        event_bus.$emit("toast", {
          message: "The new password must be different from old",
          type: "error"
        });
      }
    }
  }
};
</script>

<style>

</style>