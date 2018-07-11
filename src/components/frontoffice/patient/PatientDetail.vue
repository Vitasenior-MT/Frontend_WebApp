<template>
  <v-content style="height:100%">
    <v-layout wrap style="padding-right:25px; padding-top:25px; padding-left:25px">
      <v-flex class="text-md-center" xs12 style="padding-bottom:20px">
        <v-card dark style="width: 100%; padding-bottom: 20px;" flat>
          <v-card-title primary-title>
            <div>
              <h1 class="main-title mb-0">
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
        <v-card dark flat style="height:100%; padding-bottom:10px">
          <div class="text-xs-center">
            <v-avatar size="150px" style="margin-top:10%; margin-bottom:10px">
              <img
              class="img-circle elevation-7 mb-1"
              src="@/assets/logo.png"
              >
            </v-avatar>
          </div>
          <v-list dark >
            <v-list-tile >
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center" style="color:#3faf7d;">ID</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.id }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content >
                <v-list-tile-sub-title class="text-xs-center" style="color:#3faf7d;">Birthdate</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.birthdate }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center" style="color:#3faf7d;">Gender</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.gender }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center" style="color:#3faf7d;">Weight</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.weight }} kg</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-sub-title class="text-xs-center" style="color:#3faf7d;">Height</v-list-tile-sub-title>
                <v-list-tile-title class="text-xs-center">{{ this.$store.state.patient.height }} m</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex xs12 md8>
        <v-card dark flat style="height:70%;">
          <v-data-table
            :headers="headers"
            :items="this.$store.state.patient.Profiles"
            hide-actions
            class="elevation-1"
            dark
            >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.id }}</td>
              <td class="text-xs-left">{{ props.item.measure }}</td>
              <td class="text-xs-left">{{ props.item.min }}</td>
              <td class="text-xs-left">{{ props.item.max }}</td>
              <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                  <v-icon color="teal">fas fa-edit</v-icon>
              </v-btn>
              </td>
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
    <v-flex style="padding-bottom:20px; padding-top:10px; padding-left:15px">
      <v-btn dark @click="$router.go(-1)">
        <v-icon>fas fa-long-arrow-alt-left </v-icon> <v-span style="padding-left:10px"> Go Back</v-span>
      </v-btn>
    </v-flex>

    <add-board v-if="$store.state.vitabox.sponsor"></add-board>
    <div v-for="item in $store.state.patient.Boards" :key="item.id">{{item}}<br><br></div>
    <add-doctor v-if="$store.state.vitabox.sponsor"></add-doctor>
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
      dialog: false,
      headers: [
        { text: "Profile", value: "profile", sortable: false, class: "headers" },
        { text: "Measure", value: "measure", sortable: false, class: "headers" },
        { text: "Min", value: "min", sortable: false, class: "headers" },
        { text: "Max", value: "max", sortable: false, class: "headers" },
        { text: "Actions", value: "actions", sortable: false, class: "headers" }
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
    console.log(this.$store.state.patient);
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
    },
    editItem(item) {
      this.editedIndex = this.$store.state.patient.Profiles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.$store.state.patient.Profiles.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.$store.state.patient.Profiles.splice(index, 1);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(
          this.$store.state.patient.Profiles[this.editedIndex],
          this.editedItem
        );
      } else {
        this.$store.state.patient.Profiles.push(this.editedItem);
      }
      this.close();
    }
  },
  components: {
    "add-board": SetBoard,
    "add-doctor": SetDoctor
  }
};
</script>

<style>
.headers {
    color: #3faf7d !important;
}
</style>
