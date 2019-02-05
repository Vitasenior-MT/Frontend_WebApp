<template>
  <v-content id="sensor_menu">
    <v-card tile>
      <v-card-title  class="pl-0">
        <create-sensor @new="(val)=>setItem(val)"></create-sensor>

        <v-spacer></v-spacer>
        <v-text-field prepend-icon="fas fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>
        
      <v-data-table :headers="headers" :search="search" :items="sensors" class="elevation-1" sort-icon="fas fa-angle-down" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" :rows-per-page-items="[10]">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.measure }}</td>
          <td>{{ props.item.to_read }}</td>
          <td>{{ props.item.tag }}</td>
          <td>{{ props.item.transducer }}</td>
          <td>[{{ Math.round(props.item.min_acceptable) }};{{ Math.round(props.item.max_acceptable) }}]</td>
          <td>[{{ Math.round(props.item.min_possible) }};{{ Math.round(props.item.max_possible) }}]</td>
          <td>[{{ Math.round(props.item.min_graph) }};{{ Math.round(props.item.max_graph) }}]</td>
          <td class="right px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)"><v-icon color="secondary">fas fa-edit</v-icon></v-btn>
            <v-btn icon class="mx-0" @click="deleteItention(props.item)"><v-icon color="error">fas fa-minus-circle</v-icon></v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog_edit_sensor" max-width="500px">
      <edit-sensor @close="()=>dialog_edit_sensor=false" @update="(item)=>update(item)" :item="temp_sensor"></edit-sensor>
    </v-dialog>

    <v-dialog v-model="dialog_remove_sensor" max-width="500px">
      <delete-sensor @close="()=>dialog_remove_sensor=false" @delete="remove" :item="temp_sensor"></delete-sensor>
    </v-dialog>

  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import CreateSensor from "@/components/backoffice/sensormodel/SensormodelCreate.vue";
import EditSensor from "@/components/backoffice/sensormodel/SensormodelEdit.vue";
import DeleteSensor from "@/components/backoffice/sensormodel/SensormodelDelete.vue";

export default {
  name: "sensor_menu",
  data: () => {
    return {
      search: "",
      headers: [
        { text: "Measure", align: "left", value: "measure" },
        { text: "Full Name", align: "left", value: "to_read" },
        { text: "Tag", align: "left", value: "tag" },
        { text: "Transducer", align: "left", value: "transducer" },
        { text: "Acceptable", align: "left", sortable: false },
        { text: "Possible", align: "left", sortable: false },
        { text: "Graph thresholds", align: "left", sortable: false },
        { text: "Actions", align: "right", sortable: false }
      ],
      sensors: [],
      temp_sensor: null,
      dialog_remove_sensor: false,
      dialog_edit_sensor: false
    };
  },
  created() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/sensormodel")
        .then(response => {
          this.sensors = response.data.sensors;
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
    editItem(item) {
      this.dialog_edit_sensor = true;
      this.temp_sensor = item;
    },
    setItem(item) {
      this.sensors.push(item);
      event_bus.$emit("waiting", false);
    },
    update(item) {
      this.sensors[this.sensors.indexOf(this.temp_sensor)] = item;
      this.dialog_edit_sensor = false;
      event_bus.$emit("waiting", false);
    },
    deleteItention(item) {
      this.temp_sensor = item;
      this.dialog_remove_sensor = true;
    },
    remove() {
      this.sensors.splice(this.sensors.indexOf(this.temp_sensor), 1);
      this.dialog_remove_sensor = false;
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "create-sensor": CreateSensor,
    "edit-sensor": EditSensor,
    "delete-sensor": DeleteSensor
  }
};
</script>

<style>
</style>