<template>
  <div>
    <v-data-table :headers="headersUsers" :items="vitaboxUsers" hide-actions class="elevation-1" dark >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">no data to display here</v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      },
      headersUsers: [
        { text: "Name", value: "name", sortable: false, class: "headers" },
        { text: "Email", value: "email", sortable: false, class: "headers" },
        { text: "Since", value: "since", sortable: false, class: "headers" }
      ],
      vitaboxUsers: [],
      map: null,
      marker: null
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.vitaboxUsers = [];
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/user")
        .then(response => {
          this.vitaboxUsers = response.data.users;
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
    gotoUserProfile(user) {
      this.$router.push("/user/detail");
    }
  }
};
</script>
