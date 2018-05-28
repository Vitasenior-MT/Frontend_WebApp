<template>
    <div style="margin-top:35px; margin-left:10px; margin-right:10px">
    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Location</v-list-tile-title>
            {{ $store.state.vitabox.address }}
          </v-list-tile-content>
          <v-list-tile-content >
            <v-list-tile-title>Registered</v-list-tile-title>
            <v-icon v-if="this.$store.state.vitabox.registered === true">mdi-check</v-icon> 
            <v-icon v-else>mdi-close</v-icon>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title>Active</v-list-tile-title>
            <v-icon v-if="this.$store.state.vitabox.active === true">mdi-check</v-icon> 
            <v-icon v-else>mdi-close</v-icon> 
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    <div>
    <br>
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
    </div>
    <div style="margin-top:20px">
    <v-data-table
      :headers="headers"
      :items="boards"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.mac_addr }}</td>
        <td class="text-xs-left" v-if="props.item.active === true"><v-icon>mdi-check</v-icon></td>
        <td class="text-xs-left" v-else><v-icon>mdi-close</v-icon></td>
        <td class="text-xs-left">{{ props.item.updated_at }}</td>
        <td class="justify-left layout px-0">
          <v-btn @click='goToBoardDetails(props.item)'>
            <v-icon >mdi-information-outline</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="mdi-alert">
          Sorry, nothing to display here :(
        </v-alert>
      </template>
    </v-data-table>
    <v-flex style="margin-bottom: 40px">
      <v-btn @click="$router.go(-1)">
            <v-icon >mdi-keyboard-return</v-icon>
      </v-btn>
    </v-flex>
  </div>
  </div>
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
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
        .then(response => {
          this.boards = response.data.boards;
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
        });
    },
    goToBoardDetails(boardData) {
      this.$store.commit("setVitaboxBoardData", boardData);
      this.$router.push("/board/detail");
    }
  }
};
</script>