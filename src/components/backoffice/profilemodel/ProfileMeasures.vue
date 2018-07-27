<template>
  <v-card id="profilemodel_measures">
    <v-card-title>
      <span class="headline">Profile measures</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-actions class="py-0">
      <add-measure :profile="item" @new="pushMeasure"></add-measure>
    </v-card-actions>
    <v-card-text class="px-5">
      <v-divider light></v-divider>
      <v-list v-if="item.measures.length>0">
        <v-list-tile v-for="measure in item.measures" :key="measure.id" two-line @click="()=>{}">
          <v-list-tile-content>
            <v-list-tile-title class="raven--text">{{measure.measure}}</v-list-tile-title>
            <v-list-tile-sub-title>[ {{measure.min}} - {{measure.max}} ]</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn flat icon small @click.native="removeMeasure(measure)"><v-icon color="error">fas fa-minus-circle</v-icon></v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <div v-else class="subheading text-xs-center warning--text">This profile model has no measures</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import AddMeasure from "./AddMeasureToProfile.vue";

export default {
  name: "profilemodel_measures",
  props: {
    item: Object
  },
  methods: {
    close() {
      this.$emit("close");
    },
    pushMeasure(val) {
      this.item.measures.push(val);
      event_bus.$emit("waiting", false);
    },
    removeMeasure(measure) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .delete("/profilemodel/" + this.item.id + "/measure/" + measure.id)
        .then(response => {
          this.item.measures.splice(this.item.measures.indexOf(measure), 1);
          event_bus.$emit("toast", {
            message: "profile measure was successfully removed",
            type: "success"
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
  components: {
    "add-measure": AddMeasure
  }
};
</script>
