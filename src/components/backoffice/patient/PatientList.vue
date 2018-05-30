<template>
  <v-card tile id="vitabox_users">
    
    <v-card-title>
      <span class="headline">Patients</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-actions class="py-0">
      <add-patient-to-box :box="item" @update="(patient)=>setPatient(patient)"></add-patient-to-box>
    </v-card-actions>

    <v-card-text class="px-5">
      <v-divider light></v-divider>

      <v-list v-if="patients.length>0">
        <router-link v-for="patient in patients" :key="patient.id" :to="{name: 'PatientDashboard', params: { patient:patient, box:item } }">
          <v-list-tile two-line @click="()=>{}">
            <v-list-tile-content>
              <v-list-tile-title class="raven--text">{{patient.name}}</v-list-tile-title>
              <v-list-tile-sub-title>age: {{patient.age}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon v-if="patient.active" color="secondary">fas fa-heartbeat</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>
      </v-list>

      <div v-else class="subheading text-xs-center warning--text">This vitabox has no patients</div>
    </v-card-text>

  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import AddPatient from "@/components/backoffice/patient/AddToVitabox.vue";

export default {
  name: "vitabox_users",
  props: {
    item: Object
  },
  data: () => {
    return {
      patients: [],
      dialog_remove_patient: false,
      temp_patient: null
    };
  },
  created() {
    event_bus.$emit("waiting", true);
    event_bus.$data.http
      .get("/vitabox/" + this.item.id + "/patient")
      .then(response => {
        let today = new Date();
        response.data.patients.map(x => {
          let birthdate = new Date(x.birthdate);
          this.patients.push({
            birthdate: birthdate,
            age:
              today.getMonth() < birthdate.getMonth() ||
              (today.getMonth() === birthdate.getMonth() &&
                today.getDate() < birthdate.getDate())
                ? today.getFullYear() - birthdate.getFullYear() - 1
                : today.getFullYear() - birthdate.getFullYear(),
            name: x.name,
            id: x.id,
            gender: x.gender,
            since: x.since,
            active: x.active
          });
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
  },
  watch: {
    item(val) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + val.id + "/patient")
        .then(response => {
          this.patients = [];
          let today = new Date();
          response.data.patients.map(x => {
            let birthdate = new Date(x.birthdate);
            this.patients.push({
              birthdate: birthdate,
              age:
                today.getMonth() < birthdate.getMonth() ||
                (today.getMonth() === birthdate.getMonth() &&
                  today.getDate() < birthdate.getDate())
                  ? today.getFullYear() - birthdate.getFullYear() - 1
                  : today.getFullYear() - birthdate.getFullYear(),
              name: x.name,
              id: x.id,
              gender: x.gender,
              since: x.since
            });
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
  },
  methods: {
    close() {
      this.$emit("close");
    },
    setPatient(item) {
      this.patients.push(item);
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "add-patient-to-box": AddPatient
  }
};
</script>

