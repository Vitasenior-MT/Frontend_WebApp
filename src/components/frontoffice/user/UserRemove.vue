<template>
  <div id="remove_user">
    <v-tooltip bottom>
      <v-btn
        slot="activator"
        flat
        icon
        small
        color="error"
        @click.native="()=>dialog_remove_user=true"
      >
        <v-icon>fas fa-minus-circle</v-icon>
      </v-btn>
      <span>{{ $t('frontoffice.user.remove_tooltip') }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog_remove_user" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline error--text">{{ $t('frontoffice.user.remove_title') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_remove_user=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>{{ $t('frontoffice.user.remove_text') }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            dark
            color="error darken-1"
            block
            @click.native="removeItem"
          >{{ $t('frontoffice.user.submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "remove_user",
  props: {
    box: Object,
    user: Object
  },
  data: () => {
    return {
      dialog_remove_user: false
    };
  },
  methods: {
    removeItem() {
      event_bus.$emit("waiting", true);
      this.dialog_remove_user = false;

      event_bus.$data.http
        .delete("/vitabox/" + this.box.id + "/user", {
          data: {
            user_id: this.user.id
          }
        })
        .then(response => {
          this.$emit("remove", this.user);
          event_bus.$emit("toast", {
            message: "user was successfully removed from vitabox",
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
    }
  }
};
</script>