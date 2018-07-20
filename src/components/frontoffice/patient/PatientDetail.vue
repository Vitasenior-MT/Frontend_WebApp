<template>
  <v-content style="height:100%">
    <v-layout wrap>
      <v-flex class="pt-2 text-md-center" xs12>
        <v-card dark width="100%" class="pb-2" flat>
          <v-card-title primary-title>
            <div>
              <h1 class="main-title mb-0 primary_l--text">
                Patient - 
                <span class="thin">
                  {{ this.$store.state.patient.name}}
                </span>
              </h1>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 md4 >
        <v-card dark flat height="100%" class="pb-1">
          <div class="text-xs-center">
            <v-avatar size="150px" class="mt-1 mb-1">
              <img class="img-circle elevation-7 mb-1" src="@/assets/logo.png">
            </v-avatar>
          </div>
          <v-list dark >
            <v-list-tile >
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center primary--text">ID</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.id }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content >
                <v-list-tile-sub-title class="text-xs-center primary--text">Birthdate</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.birthdate }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center primary--text">Gender</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.gender }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center primary--text">Weight</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.weight }} kg</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center primary--text">Height</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.height }} m</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 md8>
        <v-card dark flat height="70%">
          <v-data-table :headers="headers" :items="this.$store.state.patient.Profiles" class="elevation-1" dark sort-icon="fas fa-angle-down" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" :rows-per-page-items="[10]">
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.measure }}</td>
              <td class="text-xs-left">{{ props.item.min }}</td>
              <td class="text-xs-left">{{ props.item.max }}</td>
            </template>
            <template slot="no-data">
              <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                  Sorry, nothing to display here :(
              </v-alert>
            </template>
          </v-data-table>    
        </v-card>
      </v-flex>
    </v-layout>
    <v-flex class="pb-2 pt-1">
      <v-btn dark class="ml-0" @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <span class="pl-1"> Go Back</span>
      </v-btn>
    </v-flex>

    <add-board v-if="$store.state.vitabox.sponsor"></add-board>
    <div v-for="item in $store.state.patient.Boards" :key="item.id">{{item}}<br><br></div>
    <add-doctor v-if="$store.state.vitabox.sponsor"></add-doctor>
    <div v-for="item in $store.state.patient.Doctors" :key="item.id">{{item}}<br><br></div>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import SetBoard from "@/components/frontoffice/patient/SetBoard.vue";
import SetDoctor from "@/components/frontoffice/patient/SetDoctor.vue";

export default {
  data() {
    return {
      measures: [],
      headers: [
        {
          text: "Profile",
          value: "measure",
          sortable: true,
          class: "headers"
        },
        { text: "Min", value: "min", sortable: false, class: "headers" },
        { text: "Max", value: "max", sortable: false, class: "headers" }
      ]
    };
  },
  mounted() {
    this.getMeasures();
  },
  methods: {
    getMeasures() {
      this.measures = [];
      this.$store.state.patient.Boards.forEach(board => {
        board.Sensors.forEach(sensor => {
          this.measures.push({ text: sensor.Sensormodel.measure });
        });
      });
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
