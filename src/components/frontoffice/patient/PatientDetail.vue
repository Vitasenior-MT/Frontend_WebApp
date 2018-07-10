<template>
  <v-content style="padding-left:240px">
    <v-layout wrap>
      <v-flex xs12 md4>
        <v-card dark flat class="pa-0" style="height:100%;">
          <div class="text-xs-center">
            <v-avatar size="150px" style="margin-top:10%">
              <img
              class="img-circle elevation-7 mb-1"
              src="@/assets/logo.png"
              >
            </v-avatar>
            <div class="headline">{{ this.$store.state.patient.name }}</div>
            <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.id }}</div>
            <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.birthdate }}</div>
            <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.gender }}</div>
            <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.weight }} kg</div>
            <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.height }} m</div>
          </div>
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
    <v-flex style="margin-bottom: 40px">
        <v-btn dark @click="$router.go(-1)">
            <v-icon>fas fa-long-arrow-alt-left </v-icon>
        </v-btn>
    </v-flex>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      measures: [],
      dialog: false,
      headers: [
        { text: "Profile", value: "profile", sortable: false },
        { text: "Measure", value: "measure", sortable: false },
        { text: "Min", value: "min", sortable: false },
        { text: "Max", value: "max", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
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
  }
};
</script>

<style >
</style>
