<template>
    <v-content>
    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <v-list dark>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Location</v-list-tile-title>
            {{ $store.state.vitabox.address }}
          </v-list-tile-content>
          <v-list-tile-content >
            <v-list-tile-title>Registered</v-list-tile-title>
            <v-icon v-if="this.$store.state.vitabox.registered === true">fas fa-check-circle</v-icon> 
            <v-icon v-else>fas fa-times-circle</v-icon>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title>Active</v-list-tile-title>
            <v-icon v-if="this.$store.state.vitabox.active === true">fas fa-check-circle</v-icon> 
            <v-icon v-else>fas fa-times-circle</v-icon> 
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    <gmap-map
      :center="center"
      :zoom="15"
      style="width:100%;  height: 400px;"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
    <v-data-table
      :headers="headers"
      :items="boards"
      hide-actions
      class="elevation-1"
      dark
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.Boardmodel.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.mac_addr }}</td>
        <td class="text-xs-left" v-if="props.item.active === true"><v-icon>fas fa-check-circle</v-icon></td>
        <td class="text-xs-left" v-else><v-icon>fas fa-times-circle</v-icon></td>
        <td class="text-xs-left">{{ props.item.updated_at }}</td>
        <td class="justify-left layout px-0">
          <v-btn @click='goToBoardDetails(props.item)'>
            <v-icon >fas fa-info-circle</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
          Sorry, nothing to display here :(
        </v-alert>
      </template>
    </v-data-table>
    <v-flex style="margin-bottom: 40px">
      <v-btn dark @click="$router.go(-1)">
            <v-icon>fas fa-long-arrow-alt-left </v-icon>
      </v-btn>
    </v-flex>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      headers: [
        { text: "Board", value: "board", sortable: false },
        { text: "Location", value: "description", sortable: false },
        { text: "MAC", value: "mac_address", sortable: false },
        { text: "Active?", value: "active", sortable: false },
        { text: "Last Update", value: "updated_at", sortable: false },
        { text: "Details", value: "name", sortable: false }
      ],
      boards: [],
      center: { lat: null, lng: null },
      markers: [],
      places: []
    };
  },
  created() {
    this.getBoards();
  },
  mounted() {
    this.center = {
      lat: Number(this.$store.state.vitabox.latitude),
      lng: Number(this.$store.state.vitabox.longitude)
    };
    const marker = {
      lat: Number(this.$store.state.vitabox.latitude),
      lng: Number(this.$store.state.vitabox.longitude)
    };
    this.markers.push({ position: marker });
    this.places.push(this.currentPlace);
    this.center = marker;
  },
  methods: {
    getBoards() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
        .then(response => {
          this.boards = response.data.boards;
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
    goToBoardDetails(boardData) {
      this.$store.commit("setBoardData", boardData);
      this.$router.push("/board/detail");
    }
  }
};
</script>