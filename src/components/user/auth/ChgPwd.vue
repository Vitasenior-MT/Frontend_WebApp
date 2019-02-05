<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{$t('user.auth.alter_pass')}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="old_password"
          name="oldpwd"
          :label="$t('user.auth.old_pass')"
          id="oldpwd"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="new_password"
          name="newpwd"
          :label="$t('user.auth.new_pass')"
          id="newpwd"
          type="password"
          :rules="[() => new_password !== old_password || 'The new password must be different from old']"
        ></v-text-field>
        <v-text-field
          v-model="confirmed_password"
          name="confpwd"
          :label="$t('user.auth.confirm_pass')"
          id="confpwd"
          type="password"
          :rules="[() => new_password === confirmed_password || 'The password don\'t match']"
        ></v-text-field>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary_d" flat @click.native="save">{{$t('user.auth.submit')}}</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data: () => {
    return {
      old_password: "",
      new_password: "",
      confirmed_password: ""
    };
  },
  created: () => {},
  methods: {
    close() {
      this.$emit("close");
    },
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