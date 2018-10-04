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
          <v-flex>
            <v-text-field :rules="[() => (parseInt(frequency)>0 && parseInt(frequency)<360) || 'invalid time interva between exams']" label="Frequency" v-model="item.frequency" type="number" suffix="hours"></v-text-field>
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
  name: "edit_exam",
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .put("/patient/" + this.$store.state.patient.id + "/exam", {
          board_id: this.item.id,
          frequency: this.item.frequency
        })
        .then(response => {
          this.$store.commit("setPatientBoardData", this.item);

          event_bus.$emit("toast", {
            message: "exam was successfully updated",
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
    }
  }
};
</script>