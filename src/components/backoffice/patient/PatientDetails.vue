<template>
  <v-content id="dashboard_patient" v-if="patient">

    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 md4>

          <v-card>
            <v-card-title class="pb-0">
              <label class="ash--text mr-2">id</label>
              <label>{{patient.id}}</label>
              <p class="headline">{{patient.name}}</p>
            </v-card-title>
            <v-card-text class="pt-0">
              <label class="primary_d--text">age</label>
              <label>{{patient.age}} years</label><br>
              
              <div id="dashboard_patient_div">
                <label class="primary_d--text">vitabox</label>
                <v-btn id="dashboard_patient_icon" flat icon small color="error" @click.native="()=>dialog_remove_patient=true"><v-icon>fas fa-minus-circle</v-icon></v-btn>
                <p>{{box.address}}</p>
              </div>

              <div id="dashboard_patient_div" class="mb-3">
                <label class="primary_d--text">activity status</label>
                <v-btn id="dashboard_patient_icon" class="mt-0" flat icon small @click.native="()=>dialog_disable_patient=true">
                  <v-icon v-if="patient.active">fas fa-pause-circle</v-icon>
                  <v-icon v-else>fas fa-play-circle</v-icon>
                </v-btn>
              </div>
              
              <v-divider></v-divider>
              <set-board-to-patient :patient="patient" :box="box" @added="(item)=>boardAdded(item)"></set-board-to-patient>
              <v-expansion-panel>
                <v-expansion-panel-content v-for="board in boards" :key="board.id" expand-icon="fas fa-angle-down">
                  <div slot="header">{{board.Boardmodel.name}}</div>
                  <sensor-graph :sensors="board.Sensors" :patient="patient.id"></sensor-graph>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card-text>
          </v-card>
        </v-flex>

        <v-flex xs12 md8>
          
        </v-flex>

      </v-layout>
    </v-container>

    <v-dialog v-model="dialog_remove_patient" max-width="500px">
      <remove-patient-from-vitabox @close="()=>dialog_remove_patient=false" @remove="remove" :patient="patient" :box="box"></remove-patient-from-vitabox>
    </v-dialog>
    <v-dialog v-model="dialog_disable_patient" max-width="500px">
      <disable-patient @close="()=>dialog_disable_patient=false" @disable="disable" :patient="patient" :box="box" :action="patient.active?'disable':'enable'"></disable-patient>
    </v-dialog>

  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SensorPatient from "@/components/backoffice/sensor/SensorFromPatient.vue";
import RemovePatient from "@/components/backoffice/patient/RemoveFromVitabox.vue";
import DisablePatient from "@/components/backoffice/patient/PatientDisable.vue";
import SetBoardToPatient from "@/components/backoffice/board/SetToPatient.vue";

export default {
  name: "dashboard_patient",
  props: {
    patient: Object,
    box: Object
  },
  data: () => {
    return {
      boards: [],
      sensors: [],
      dialog_remove_patient: false,
      dialog_disable_patient: false,
      selected_board: null,
      selected_sensor: null
    };
  },
  mounted() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      if (this.patient) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .get("/patient/" + this.patient.id + "/board")
          .then(response => {
            console.log(response.data.boards);
            this.boards = response.data.boards;
            this.sensors = this.boards.length > 0 ? this.boards[0].Sensors : [];
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
          message: "Patient undefined",
          type: "error"
        });
      }
    }
  },
  methods: {
    formatDate(date) {
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let d = new Date(date);
      return (
        d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear()
      );
    },
    getTime(date) {
      let miliseconds = new Date() - new Date(date);
      if (miliseconds < 1000) return "<1 sec";
      else if (miliseconds < 60000) {
        return "~" + Math.floor(miliseconds / 1000) + " sec";
      } else if (miliseconds < 3600000) {
        return "~" + Math.floor(miliseconds / 60000) + " min";
      } else if (miliseconds < 86400000) {
        return Math.floor(miliseconds / 3600000) + " hours";
      } else return ">24 hours";
    },
    remove() {
      this.dialog_remove_patient = false;
      this.$router.push("/vitabox/list ");
      event_bus.$emit("waiting", false);
    },
    disable() {
      this.dialog_disable_patient = false;
      this.patient.active = !this.patient.active;
      event_bus.$emit("waiting", false);
    },
    boardAdded(id) {
      event_bus.$data.http
        .get("/board/" + id)
        .then(response => {
          this.boards.push(response.data.board);
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", { message: error.message, type: "error" });
          }
          event_bus.$emit("waiting", false);
        });
    }
  },
  components: {
    "sensor-graph": SensorPatient,
    "remove-patient-from-vitabox": RemovePatient,
    "disable-patient": DisablePatient,
    "set-board-to-patient": SetBoardToPatient
  }
};
</script>

<style>
#dashboard_patient_div {
  position: relative;
  width: 100%;
}
#dashboard_patient_icon {
  position: absolute;
  right: 0;
}
</style>