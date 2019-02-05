<template>
  <v-expansion-panel id="add_board_to_patient" popout>
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary">
          <v-icon class="pr-2">fas fa-plus</v-icon>
          <label>{{$t('frontoffice.patient.add_doctor')}}</label>
        </v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-text-field
              prepend-icon="fas fa-user-md"
              v-model="email"
              name="email"
              :label="$t('frontoffice.patient.doctor_email')"
              id="email"
              type="text"
              :rules="[() => ((email.length>5 && email.indexOf('@') > -1) || email.length==0) || 'Invalid email']"
            ></v-text-field>
            <v-flex sm4 md3>
              <v-btn
                block
                class="mt-3"
                dark
                color="ash"
                @click.native="save"
              >{{$t('frontoffice.patient.save')}}</v-btn>
            </v-flex>
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
            event_bus.$emit("toast", {
              message: "doctor was successfully defined to user",
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
          message: "insert all fields",
          type: "error"
        });
      }
    }
  }
};
</script>