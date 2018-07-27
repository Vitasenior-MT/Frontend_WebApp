<template>
  <v-content style="height:100%">
    <v-layout row wrap>
        <v-flex xs12 class="pa-0">
          <v-layout class="text-md-center">
            <v-card dark class="pb-3" width="100%" flat>
              <v-card-title primary-title>
                <h1 class="main-title pb-4 primary_l--text">Patient - <span class="thin"> {{ $store.state.patient.name}} </span></h1>
              </v-card-title>
              <v-card-text class="pt-3">
                <h5 class="grey--text"> {{ $store.state.patient.id}} </h5>
              </v-card-text>
            </v-card>
          </v-layout>
        </v-flex>
    </v-layout>
    <v-layout row wrap class="pb-1">
        <v-flex md12 lg4 class="pa-0">
          <v-layout fill-height>
            <v-card dark width="100%" height="100%" class="text-xs-center" flat>
              <v-avatar class="patientAvatar" size="150px"><img src="@/assets/logo.png"></v-avatar>
              <br/>
              <v-icon v-if="$store.state.patient.gender == 'male'" class="cyan--text">fas fa-mars</v-icon>
              <v-icon v-if="$store.state.patient.gender == 'female'" class="pink--text">fas fa-venus</v-icon>
              <v-icon v-if="$store.state.patient.gender == 'undefined'" class="pink--text">fas fa-times-circle</v-icon>
              <v-list dark >
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Weight</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.weight ? this.$store.state.patient.weight:'null' }} kg</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Height</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.height ? this.$store.state.patient.height:'null' }} m</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Age</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ this.calculate_age($store.state.patient.birthdate) }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-content>
                    <v-list-tile-sub-title class="text-xs-center primary--text">Birthdate</v-list-tile-sub-title>
                    <v-list-tile-title class="text-xs-center">{{ $store.state.patient.birthdate }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-layout>
        </v-flex>
        <v-flex md12 lg8>
        <v-card dark flat height="100%">
          <v-tabs centered color="primary" dark icons-and-text>
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tab href="#tab-1">
              Profiles
              <v-icon>fas fa-clipboard</v-icon>
            </v-tab>
            <v-tab href="#tab-2">
              Doctors
              <v-icon>fas fa-user-md</v-icon>
            </v-tab>
            <v-tab href="#tab-3">
              Boards
              <v-icon>fas fa-microchip</v-icon>
            </v-tab>
            <v-tab-item v-for="i in 3" :id="'tab-' + i" :key="i">
              <v-data-table v-if="i == 1" :headers="headersProfiles" :items="$store.state.patient.Profiles" hide-actions class="elevation-1" dark  sort-icon="fas fa-sort-down">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.measure }}</td>
                  <td class="text-xs-left">{{ props.item.min }}</td>
                  <td class="text-xs-left">{{ props.item.max }}</td>
                </template>
                <template slot="no-data">
                  <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                      No data to display here 
                  </v-alert>
                </template>
              </v-data-table>  
              <add-doctor v-if="$store.state.vitabox.sponsor && i == 2"></add-doctor>
              <v-data-table v-if="i == 2" :headers="headersDoctors" :items="$store.state.patient.Doctors" hide-actions class="elevation-1" dark  sort-icon="fas fa-sort-down">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.email }}</td>
                  <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
                  <td class="justify-center layout px-0">
                  </td>
                </template>
                <template slot="no-data">
                  <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                      No data to display here 
                  </v-alert>
                </template>
              </v-data-table>
              <add-board v-if="$store.state.vitabox.sponsor && i==3"></add-board>  
              <v-data-table v-if="i == 3" :headers="headersBoards" :items="$store.state.patient.Boards" hide-actions class="elevation-1" dark  sort-icon="fas fa-sort-down">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.Boardmodel.name }}<label v-if="props.item.description"> - </label>{{ props.item.description}}</td>
                  <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
                </template>
                <template slot="no-data">
                  <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                      No data to display here 
                  </v-alert>
                </template>
              </v-data-table>  
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
    <v-flex class="pb-2">
      <v-btn dark class="ml-0" @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <span class="pl-1"> Go Back</span>
      </v-btn>
    </v-flex>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SetBoard from "@/components/frontoffice/patient/SetBoard.vue";
import SetDoctor from "@/components/frontoffice/patient/SetDoctor.vue";

export default {
  data() {
    return {
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      },
      measures: [],
      dialog: false,
      headersProfiles: [
        { text: "Measure", value: "measure", sortable: true },
        { text: "Min", sortable: false },
        { text: "Max", sortable: false }
      ],
      headersDoctors: [
        { text: "Doctor", value: "name", sortable: true },
        { text: "Email", sortable: false },
        { text: "Since", sortable: false }
      ],
      headersBoards: [
        { text: "Board", value: "Boardmodel.name", sortable: true },
        { text: "Since", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        id: null,
        measure: "",
        tag: "",
        min: 0,
        max: 0
      },
      defaultItem: {
        id: null,
        measure: "",
        tag: "",
        min: 0,
        max: 0
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  mounted() {
    this.getMeasures();
  },
  methods: {
    calculate_age(dob) {
      dob = new Date(dob);
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    getMeasures() {
      this.measures = [];
      if (this.$store.state.patient.Boards) {
        this.$store.state.patient.Boards.forEach(board => {
          board.Sensors.forEach(sensor => {
            this.measures.push({ text: sensor.Sensormodel.measure });
          });
        });
      }
    }
  },
  components: {
    "add-board": SetBoard,
    "add-doctor": SetDoctor
  }
};
</script>

<style>
</style>
