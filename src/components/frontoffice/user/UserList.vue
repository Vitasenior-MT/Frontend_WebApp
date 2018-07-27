<template>
  <div v-if="users.length>0">
    <add-user v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" @adduser="(user)=>users.push(user)"></add-user>
    <v-data-table :headers="headersUsers" :items="users" hide-actions class="elevation-1" dark sort-icon="fas fa-sort-down">
      <template slot="items" slot-scope="props">
        <td><v-icon v-if="props.item.sponsor" small>fas fa-crown</v-icon></td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
        <td  v-if="$store.state.vitabox.sponsor">
          <remove-user :box="$store.state.vitabox" :user="props.item" @remove="()=>users.splice(users.indexOf(props.item), 1)"></remove-user>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">no data to display here</v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import UserAdd from "@/components/frontoffice/user/AddToVitabox.vue";
import UserRemove from "@/components/frontoffice/user/RemoveFromVitabox.vue";

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
      headersUsers: null,
      users: [],
      map: null,
      marker: null
    };
  },
  created() {
    this.getUsers();
  },
  mounted() {
    this.headersUsers = this.$store.state.vitabox.sponsor
      ? [
          { text: "Sponsor", sortable: false },
          { text: "Name", value: "name", sortable: true },
          { text: "Email", sortable: false },
          { text: "Since", sortable: false },
          { text: "Acions", sortable: false }
        ]
      : [
          { text: "Sponsor", sortable: false },
          { text: "Name", value: "name", sortable: true },
          { text: "Email", sortable: false },
          { text: "Since", sortable: false }
        ];
  },
  methods: {
    getUsers() {
      this.users = [];
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/user")
        .then(response => {
          this.users = response.data.users;
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
    }
  },
  components: {
    "add-user": UserAdd,
    "remove-user": UserRemove
  }
};
</script>
