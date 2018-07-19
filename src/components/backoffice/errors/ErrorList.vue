<template>
  <v-content >
    <v-layout wrap>
      <v-flex v-if="errors.length > 0">

        <v-list two-line>
          <template v-for="(item, index) in errors">
            <v-list-tile :key="item.id" avatar ripple>
              <v-list-tile-content>
                <v-list-tile-sub-title>{{ formatDate(item.datetime) }}</v-list-tile-sub-title>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{ item.message }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="item.seen_date!==null" >
                <v-list-tile-action-text>{{ formatDate(item.seen_date) }}</v-list-tile-action-text>
                <v-tooltip bottom>
                  <v-icon slot="activator" color="yellow darken-2">fas fa-eye</v-icon>
                  <span>{{item.seen_user}}</span>
                </v-tooltip>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <v-btn icon ripple @click.native="checkError(item)">
                  <v-icon color="grey lighten-1">fas fa-eye-slash</v-icon>
                </v-btn>
              </v-list-tile-action>

            </v-list-tile>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>

      </v-flex>
      <v-flex v-else>
        <v-card dark>
          <v-card-title primary class="title">There are no unseen errors!</v-card-title>
          <v-card-text primary> ---- </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      e13: 2,
      errors: [],
      page: 1
    };
  },
  created() {
    this.getErrors();
  },
  methods: {
    getErrors() {
      event_bus.$emit("waiting", true);
      this.errors = [];
      event_bus.$data.http
        .get("/error/" + this.page)
        .then(response => {
          this.errors = response.data.errors;
          console.log(this.errors);
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
    checkError(item) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .put("/error/" + item.id)
        .then(response => {
          item.seen_user = this.$store.state.user.name;
          item.seen_date = new Date();
          this.errors[this.errors.findIndex(x => x.id === item.id)] = item;
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