<template>
  <v-content id="model_menu">
    <v-card>
      <v-card-title class="pl-0">
        <v-spacer></v-spacer>
        <v-text-field prepend-icon="fas fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>

      <v-data-table :headers="headers" :search="search" :items="users" class="elevation-1" sort-icon="fas fa-angle-down" :pagination.sync="pagination" hide-actions>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.email }}</td>
          <td class="right px-0">
            <v-btn icon class="mx-4" @click.native="getLogs(props.item)"><v-icon>fas fa-microchip</v-icon></v-btn>
          </td>
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left"></v-pagination>
      </div>
    </v-card>

    <v-bottom-sheet v-model="dialog_get_logs" inset>
      <list-logs @close="()=>dialog_get_logs=false" :user="temp_user"></list-logs>
    </v-bottom-sheet>

  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import UserLog from "@/components/backoffice/users/UserLog.vue";

export default {
  name: "model_menu",
  data: () => {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        {
          text: "Id",
          align: "left",
          value: "id"
        },
        {
          text: "Email",
          align: "left",
          value: "email"
        },
        {
          text: "Logs",
          align: "right",
          sortable: false
        }
      ],
      users: [],
      dialog_get_logs: false,
      temp_user: null,
      pagination: {}
    };
  },
  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) {
        return 0;
      }

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }
  },
  created() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/user")
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
    getLogs(item) {
      this.dialog_get_logs = true;
      this.temp_user = item;
    }
  },
  components: {
    "list-logs": UserLog
  }
};
</script>

<style>
</style>