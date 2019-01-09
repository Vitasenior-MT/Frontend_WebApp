<template>
  <div>
    <v-card height="56" flat>
      <v-bottom-nav :active.sync="bottomNav" :value="true" absolute color="transparent">
        <v-btn color="teal" flat value="vitaboxes">
          <span>vitaboxes</span>
          <v-icon>fas fa-tv</v-icon>
        </v-btn>
        <v-btn color="teal" flat value="boards">
          <span>boards</span>
          <v-icon>fas fa-broadcast-tower</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-card>

    <v-card v-if="bottomNav==='vitaboxes'">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchVitabox"
          append-icon="fas fa-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headersVitabox"
        :items="vitaboxes"
        :search="searchVitabox"
        sort-icon="fas fa-angle-down"
        next-icon="fas fa-angle-right"
        prev-icon="fas fa-angle-left"
        :rows-per-page-items="[10]"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-right">{{ props.item.password }}</td>
          <td class="text-xs-right">{{ props.item.created_at }}</td>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ searchVitabox }}" found no results.</v-alert>
      </v-data-table>
    </v-card>

    <v-card v-else>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchBoard"
          append-icon="fas fa-search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headersBoard"
        :items="boards"
        :search="searchBoard"
        sort-icon="fas fa-angle-down"
        next-icon="fas fa-angle-right"
        prev-icon="fas fa-angle-left"
        :rows-per-page-items="[10]"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs-right">{{ props.item.Boardmodel.name }}</td>
          <td class="text-xs-right">{{ props.item.mac_addr }}</td>
          <td class="text-xs-right">{{ props.item.password }}</td>
          <td class="text-xs-right">{{ props.item.created_at }}</td>
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Your search for "{{ searchBoard }}" found no results.</v-alert>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      bottomNav: "vitaboxes",
      vitaboxes: [],
      boards: [],
      headersVitabox: [
        { text: "ID", align: "left", sortable: true, value: "id" },
        { text: "password", align: "right", sortable: false },
        { text: "created", align: "right", sortable: false }
      ],
      headersBoard: [
        { text: "ID", align: "left", sortable: true, value:"id" },
        { text: "model", align: "right", sortable: true, value:"Boardmodel.name" },
        { text: "MAC address", align: "right", sortable: true, value:"mac_addr" },
        { text: "password", align: "right", sortable: false },
        { text: "created", align: "right", sortable: false }
      ],
      searchVitabox: "",
      searchBoard: ""
    };
  },
  created() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      event_bus.$emit("waiting", true);

      Promise.all([
        event_bus.$data.http.get("/inactive/vitabox"),
        event_bus.$data.http.get("/inactive/board")
      ])
        .then(res => {
          console.log(res[1].data.boards);
          this.vitaboxes = res[0].data.vitaboxes;
          this.boards = res[1].data.boards;
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
  }
};
</script>
