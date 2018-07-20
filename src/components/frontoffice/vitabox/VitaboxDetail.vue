<template>
  <v-content>
    <v-layout wrap>
      <v-flex class="pt-0 text-md-center" xs12>
        <v-card dark width="100%" class="pb-1" flat>
          <v-card-title primary-title>
            <div>
              <h1 class="primary_l--text main-title mb-0">
                Vitabox - 
                <span class="thin">
                  {{ this.$store.state.vitabox.address}}
                </span>
              </h1>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-list dark >
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">Location</v-list-tile-sub-title>
              <v-list-tile-title>{{ $store.state.vitabox.address }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content >
              <v-list-tile-sub-title class="primary--text">Registered</v-list-tile-sub-title>
              <v-list-tile-title v-if="this.$store.state.vitabox.registered === true"><v-icon >fas fa-check-circle</v-icon></v-list-tile-title>
              <v-list-tile-title v-else><v-icon>fas fa-times-circle</v-icon></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-content>
              <v-list-tile-sub-title class="primary--text">Active</v-list-tile-sub-title>
              <v-list-tile-title v-if="this.$store.state.vitabox.active === true"><v-icon >fas fa-check-circle</v-icon> </v-list-tile-title>
              <v-list-tile-title  v-else><v-icon>fas fa-times-circle</v-icon> </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex xs12 class="pa-0">
        <div id="google-map-box"></div>
      </v-flex>
      <v-flex xs12 class="pt-1">
          <v-card dark flat height="100%">
            <v-tabs
              centered
              color="primary"
              dark
              icons-and-text
            >
              <v-tabs-slider color="white"></v-tabs-slider>
              <v-tab href="#tab-1">
                Users
                <v-icon>fas fa-user</v-icon>
              </v-tab>
              <v-tab href="#tab-2">
                Patients
                <v-icon>fas fa-heartbeat</v-icon>
              </v-tab>
              <v-tab href="#tab-3">
                Boards
                <v-icon>fas fa-microchip</v-icon>
              </v-tab>
              <v-tab-item
                v-for="i in 3"
                :id="'tab-' + i"
                :key="i"
              >
                <v-data-table
                  v-if="i == 1"
                  :headers="headersUsers"
                  :items="vitaboxUsers"
                  hide-actions
                  class="elevation-1"
                  dark
                  >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{ props.item.name }}</td>
                    <td class="text-xs-left">{{ props.item.email }}</td>
                    <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
                  </template>
                  <template slot="no-data">
                    <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                        Sorry, nothing to display here 
                    </v-alert>
                  </template>
                </v-data-table>  
                <add-patient v-if="$store.state.vitabox.sponsor & i == 2" :box="$store.state.vitabox" @addpatient="(patient)=>patients.push(patient)"></add-patient>
                <v-data-table
                  v-if="i == 2"
                  :headers="headersPatients"
                  :items="patients"
                  hide-actions
                  class="elevation-1"
                  dark
                  >
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{ props.item.name }}</td>
                    <td class="text-xs-left">
                      <v-icon v-if="props.item.gender == 'male'" class="cyan--text">fas fa-mars</v-icon>
                      <v-icon v-if="props.item.gender == 'female'" class="pink--text">fas fa-venus</v-icon>
                      <v-icon v-if="props.item.gender == 'undefined'" class="pink--text">fas fa-times-circle</v-icon>
                    </td>
                    <td class="text-xs-left">{{ calculate_age(props.item.birthdate) }}</td>
                    <td class="text-xs-left">{{ props.item.birthdate }}</td>
                    <td class="text-xs-left">{{ props.item.weight }} kg</td>
                    <td class="text-xs-left">{{ props.item.height }} m</td>
                    <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
                  </template>
                  <template slot="no-data">
                    <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                        Sorry, nothing to display here 
                    </v-alert>
                  </template>
                </v-data-table>
                <add-board v-if="$store.state.vitabox.sponsor && i == 3" :box="$store.state.vitabox" @addboard="(board)=>boards.push(board)"></add-board>
                <v-data-table
                  v-if="i == 3"
                  :headers="headersBoards"
                  :items="$store.state.patient.Boards"
                  hide-actions
                  class="elevation-1"
                  dark
                  >
                   <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{ props.item.Boardmodel.name }}</td>
                    <td class="text-xs-left">{{ props.item.description }}</td>
                    <td class="text-xs-left">{{ props.item.mac_addr }}</td>
                    <td class="text-xs-left">{{ new Date(props.item.updated_at).toLocaleDateString("pt-pt", options) }}</td>
                    <td class="text-xs-left">
                      <disable-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :board="props.item"></disable-board>
                      <span v-else> no permission </span>
                    </td>
                    <td class="justify-left layout px-0">
                      <v-btn color="primary_d" @click='goToBoardDetails(props.item)'><v-icon>fas fa-info-circle</v-icon></v-btn>
                      <remove-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :board="props.item" @remove="()=>boards.splice(boards.indexOf(props.item), 1)"></remove-board>
                    </td>
                  </template>
                  <template slot="no-data">
                    <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                      Sorry, nothing to display here :(
                    </v-alert>
                  </template>
                </v-data-table>  
              </v-tab-item>
            </v-tabs>   
          </v-card>
      </v-flex>
    </v-layout>
    <v-flex class="pb-2 pt-1">
      <v-btn dark class="ml-0" @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <span class="pl-1"> Go Back</span>
      </v-btn>
    </v-flex>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import BoardAdd from "@/components/frontoffice/board/BoardAdd.vue";
import BoardDisable from "@/components/frontoffice/board/BoardDisable.vue";
import BoardRemove from "@/components/frontoffice/board/BoardRemove.vue";
import PatientAdd from "@/components/frontoffice/patient/PatientAdd.vue";

export default {
  components: {
    "add-board": BoardAdd,
    "disable-board": BoardDisable,
    "remove-board": BoardRemove,
    "add-patient": PatientAdd
  },
  data() {
    return {
      options: { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
      headersBoards: [
        { text: "Board", value: "name", sortable: false, class: "headers" },
        {
          text: "Description",
          value: "description",
          sortable: false,
          class: "headers"
        },
        {
          text: "MAC",
          value: "mac_address",
          sortable: false,
          class: "headers"
        },
        {
          text: "Last Update",
          value: "updated_at",
          sortable: false,
          class: "headers"
        },
        { text: "State", sortable: false, class: "headers" },
        { text: "Actions", sortable: false, class: "headers" }
      ],
      headersPatients: [
        { text: "Name", value: "name", sortable: false, class: "headers" },
        { text: "Gender", value: "gender", sortable: false, class: "headers" },
        { text: "Age", value: "age", sortable: false, class: "headers" },
        { text: "Birthdate", value: "birthdate", sortable: false, class: "headers" },
        { text: "Weight", value: "Weight", sortable: false, class: "headers" },
        { text: "Height", value: "Height", sortable: false, class: "headers" },
        { text: "Since", value: "since", sortable: false, class: "headers" }
      ],
      headersUsers: [
        { text: "Name", value: "name", sortable: false, class: "headers" },
        { text: "Email", value: "email", sortable: false, class: "headers" },
        { text: "Since", value: "since", sortable: false, class: "headers" }
      ],
      boards: [],
      vitaboxUsers: [],
      patients: [],
      map: null,
      marker: null
    };
  },
  created() {
    this.getBoards();
    this.getUsers();
    this.getPatients();
  },
  mounted() {
    let myLatLng = new google.maps.LatLng(
      this.$store.state.vitabox.latitude,
      this.$store.state.vitabox.longitude
    );
    this.map = new google.maps.Map(document.getElementById("google-map-box"), {
      zoom: 15,
      center: myLatLng
    });
    this.marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: this.$store.state.vitabox.address
    });
  },
  methods: {
     calculate_age(dob) {
      dob = new Date(dob);
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    getUsers() {
      this.vitaboxUsers = [];
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/user")
        .then(response => {
          this.vitaboxUsers = response.data.users;
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
    },
    getPatients() {
      this.patients = [];
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/patient")
        .then(response => {
          this.patients = response.data.patients;
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
    },
    gotoUserProfile(user) {
      this.$router.push("/user/detail");
    },
    getBoards() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
        .then(response => {
          this.boards = response.data.boards;
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
    },
    goToBoardDetails(boardData) {
      this.$store.commit("setBoardData", boardData);
      this.$router.push("/frontoffice/board/detail");
    }
  }
};
</script>

<style>
#google-map-box {
  width: 100%;
  height: 400px;
}
.vitaboxUserMenuSelector:hover {
  cursor: pointer;
  background-color: #5b5b5b !important;
}

.userDivider {
  background-color: black !important;
}

.vitaboxUserSelector:hover {
  cursor: pointer;
  background-color: #b4b2b2 !important;
}

</style>
