<template>
  <div id="send_message">
    <v-tooltip bottom>
      <v-btn slot="activator" class="mx-1" icon @click.native="()=>dialog_send_notification=true">
        <v-icon color="teal">fas fa-paper-plane</v-icon>
      </v-btn>
      <span>send notification</span>
    </v-tooltip>
    <v-dialog v-model="dialog_send_notification" width="800" :lazy="true">
      <v-card v-if="entity">
        <v-card-title>
          <span
            class="headline primary_d--text"
          >Send message to {{to_patient?entity.name:entity.address}}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_send_notification=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-textarea
            :rules="[() => message.length > 1 || 'message is required']"
            name="message"
            v-model="message"
            label="Message"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="ash" @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "send_message",
  props: {
    to_patient: Boolean
  },
  data: () => {
    return {
      dialog_send_notification: false,
      message: "",
      entity: null
    };
  },
  updated() {
    if (this.to_patient) {
      this.entity = this.$store.state.patient;
    } else {
      this.entity = this.$store.state.vitabox;
    }
  },
  methods: {
    save() {
      if (this.message.length > 1 && this.entity) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/notification", {
            receiver: this.entity.id,
            to_patient: this.to_patient,
            message: this.message
          })
          .then(response => {
            event_bus.$emit("toast", {
              message: "notification sent sucessfully",
              type: "success"
            });
            this.dialog_send_notification = false;
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

<style>
#send_message {
  width: 100%;
}
</style>
