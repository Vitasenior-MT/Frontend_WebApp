<template>
  <v-expansion-panel id="add_board_to_patient" popout>
    <v-expansion-panel-content hide-actions>

      <div slot="header">
        <v-btn color="primary" dark><v-icon>fas fa-plus</v-icon></v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-text-field prepend-icon="fas fa-user-md" v-model="email" name="email" label="Doctor email" id="email" type="text"></v-text-field>
            <v-flex sm4 md3><v-btn block class=" mt-3" dark color="ash" @click.native="save">Save</v-btn></v-flex>
          </v-layout>
        </v-container>
      </v-form>
      
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "add_board_to_patient",
  data: () => {
    return {
      email: ""
    };
  },
  methods: {
    save() {
      if (this.email !== "" && this.email.indexOf("@") > -1) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/patient/" + this.$store.state.patient.id + "/doctor", {
            email: this.email
          })
          .then(response => {
            this.$store.commit("addDoctorToPatient", response.data.doctor);
            event_bus.$emit(
              "success",
              "doctor was successfully defined to user"
            );
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
          message: "insert all fields",
          type: "error"
        });
      }
    }
  }
};
</script>