<template>
  <div id="remove_patient">
    <v-btn flat icon small color="error" @click.native="()=>dialog_remove_patient=true">
      <v-icon>fas fa-minus-circle</v-icon>
    </v-btn>
    <v-dialog v-model="dialog_remove_patient" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline error--text">Remove patient from vitabox</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_remove_patient=false"><v-icon color="error">fas fa-times</v-icon></v-btn>
        </v-card-title>
        <v-card-text  v-if="patient">
          Removing the patient will cause the <b>loss of record history</b>.
          <v-checkbox label="Are you sure?" v-model="checked" color="raven"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!checked" block disabled>PROCEED</v-btn>
          <v-btn dark v-else color="error darken-1" block @click.native="removeItem">PROCEED</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "remove_patient",
  props: {
    box: Object,
    patient: Object
  },
  data: () => {
    return {
      dialog_remove_patient: false,
      checked: false
    };
  },
  methods: {
    removeItem() {
      event_bus.$emit("waiting", true);
      this.dialog_remove_patient = false;

      event_bus.$data.http
        .delete("/vitabox/" + this.box.id + "/patient", {
          data: {
            patient_id: this.patient.id
          }
        })
        .then(response => {
          // this.$emit("remove", this.patient);
          let patients=this.$store.state.patients;
          patients.splice(patients.indexOf(props.item), 1);
          this.$store.commit("setPatientsList", newList);
          
          event_bus.$emit("toast", {
            message: "patient was successfully removed from vitabox",
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