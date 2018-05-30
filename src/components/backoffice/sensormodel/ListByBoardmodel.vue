<template>
  <v-card id="list_sensors_by_model">
    <v-card-title class="pb-1">
      <span class="headline">Transducers</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>

    <v-card-actions class="py-0">
      <add-sensors-to-model :model="item" @update="(sensor)=>setSensor(sensor)"></add-sensors-to-model>
    </v-card-actions>
    
    <v-card-text>
      <v-list v-if="sensors.length>0" class="px-4">
        <template v-for="(sensor, index) in sensors">
          <v-divider :key="index" light></v-divider>
          <v-list-tile :key="sensor.id"  @click="()=>{}">
            <v-list-tile-content>
              <v-list-tile-title>{{sensor.transducer}}</v-list-tile-title>
              <v-list-tile-sub-title>{{ sensor.measure }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click="removeIntention(sensor)">
                <v-icon color="error">fas fa-minus-circle</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
      <div v-else class="subheading text-xs-center warning--text">This board model has no sensor</div>
      <v-divider light></v-divider>
    </v-card-text>

    <v-dialog v-model="dialog_remove_sensor" max-width="500px">
      <remove-sensor @close="()=>dialog_remove_sensor=false" @remove="remove" :sensor="temp_sensor" :model="item"></remove-sensor>
    </v-dialog>

  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import AddSensorToModel from "@/components/backoffice/sensormodel/AddToBoardmodel.vue";
import RemoveSensorFromModel from "@/components/backoffice/sensormodel/RemoveFromBoardmodel.vue";

export default {
  name: "list_sensors_by_model",
  props: {
    item: Object
  },
  data: () => {
    return {
      sensors: [],
      dialog_remove_sensor: false,
      temp_sensor: null
    };
  },
  watch: {
    item: function(val) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/boardmodel/" + val.id + "/sensor")
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
    close() {
      this.$emit("close");
    },
    removeIntention(item) {
      this.dialog_remove_sensor = true;
      this.temp_sensor = item;
    },
    remove() {
      this.sensors.splice(this.sensors.indexOf(this.temp_sensor), 1);
      this.dialog_remove_sensor = false;
      event_bus.$emit("waiting", false);
    },
    setSensor(sensor) {
      this.sensors.push(sensor);
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "add-sensors-to-model": AddSensorToModel,
    "remove-sensor": RemoveSensorFromModel
  }
};
</script>
