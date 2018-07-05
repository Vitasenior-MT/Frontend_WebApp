<template>
  <v-expansion-panel id="add_sensor_to_model" inset>
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary"><v-icon>fas fa-plus-circle</v-icon></v-btn>
      </div>
      
      <v-form class="white pt-2">
        <v-container fill-height d-inline-flex class="py-0">
          <v-select label="Search" autocomplete cache-items :items="sensors" :search-input.sync="search" v-model="selected" append-icon="fas fa-angle-down">
            <template slot="selection" slot-scope="data">
              <label class="black--text title">{{ data.item.transducer }} : {{ data.item.measure }}</label>
            </template>
            <template slot="item" slot-scope="data">
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.transducer"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.measure"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </v-select>
          <v-btn id="add_sensor_submit_button" dark color="ash" block @click.native="save">Submit</v-btn>
        </v-container>
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "add_sensor_to_model",
  props: {
    model: Object
  },
  data: () => {
    return {
      search: "",
      selected: null,
      sensors: []
    };
  },
  mounted() {
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
  },
  methods: {
    save() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .post("/boardmodel/" + this.model.id + "/sensor", {
          sensor_id: this.selected.id
        })
        .then(response => {
          this.$emit("update", this.selected);
          event_bus.$emit("toast", {
            type: "success",
            message: "transducer was successfully added to board model"
          });
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
  }
};
</script>

<style>
#add_sensor_submit_button {
  max-width: 120px;
}
</style>
