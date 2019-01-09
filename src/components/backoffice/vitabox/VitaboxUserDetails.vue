<template>
  <v-card-text id="user_details" class="pt-0">
    <v-container grid-list-md>
      <h3 class="pl-3">Details</h3>
      <v-list class="py-0">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title class="primary_l--text caption">id</v-list-tile-sub-title>
            <v-list-tile-title>{{user.id}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title class="primary_l--text caption">sponsor</v-list-tile-sub-title>
            <v-list-tile-title>{{user.sponsor}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-sub-title class="primary_l--text caption">since</v-list-tile-sub-title>
            <v-list-tile-title>{{formatDate(user.since)}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
      </v-list>
    </v-container>
  </v-card-text>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "user_details",
  props: {
    user: Object
  },
  methods: {
    formatDate(date) {
      let monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      let d = new Date(date);
      return (
        d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear()
      );
    }
  }
};
</script>

<style>
#dashboard_user_div {
  position: relative;
  width: 100%;
}
#dashboard_user_icon {
  position: absolute;
  right: 0;
}

/* #add_board_to_user_header {
  position: relative;
  display: inline;
}
#add_board_to_user_icon {
  position: absolute;
  right: 0;
} */
</style>