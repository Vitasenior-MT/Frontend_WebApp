<template>
  <v-card id="user_logs" >
    <v-card-title v-if="user!==null">
      <span class="headline">Logs - {{user.name}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close"><v-icon color="error">fas fa-times</v-icon></v-btn>
    </v-card-title>
    <v-card-text class="px-5">
      <v-divider light></v-divider>
      <v-list v-if="logs.length>0">
        <v-list-tile v-for="log in logs" :key="log.id" two-line @click="()=>{}">
          <v-list-tile-content>
            <v-list-tile-sub-title>{{formatDate(log.datetime)}}</v-list-tile-sub-title>
            <v-list-tile-title class="raven--text">{{log.message}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <div v-else class="subheading text-xs-center warning--text">This user has no log</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "user_logs",
  props: {
    user: Object
  },
  data: () => {
    return {
      logs: []
    };
  },
  watch: {
    user: function(val) {
      event_bus.$emit("waiting", true);
      console.log("user id:", val.id);
      event_bus.$data.http
        .get("/user/" + val.id + "/log")
        .then(response => {
          console.log(response.data.logs);
          this.logs = response.data.logs;
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
        d.getDate() +
        " " +
        monthNames[d.getMonth()] +
        " " +
        d.getFullYear() +
        " - " +
        d.getHours() +
        ":" +
        d.getMinutes()
      );
    }
  }
};
</script>