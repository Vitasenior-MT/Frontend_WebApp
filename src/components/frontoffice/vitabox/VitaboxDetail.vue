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
    <div id="google-map-box"></div>
    <v-data-table :headers="headers" :items="boards" hide-actions class="elevation-1" dark >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.Boardmodel.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.mac_addr }}</td>
        <td class="text-xs-left">{{ props.item.updated_at }}</td>
        <td class="text-xs-left">
          <disable-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :board="props.item"></disable-board>
        </td>
        <td class="justify-left layout px-0">
          <v-btn @click='goToBoardDetails(props.item)'><v-icon>fas fa-info-circle</v-icon></v-btn>
          <remove-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :board="props.item" @remove="()=>boards.splice(boards.indexOf(props.item), 1)"></remove-board>
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

    <add-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" @addboard="(board)=>boards.push(board)"></add-board>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import BoardAdd from "@/components/frontoffice/board/BoardAdd.vue";
import BoardDisable from "@/components/frontoffice/board/BoardDisable.vue";
import BoardRemove from "@/components/frontoffice/board/BoardRemove.vue";

export default {
  components: {
    "add-board": BoardAdd,
    "disable-board": BoardDisable,
    "remove-board": BoardRemove
  },
  data() {
    return {
      headers: [
        { text: "Board", value: "name", sortable: false },
        { text: "Description", value: "description", sortable: false },
        { text: "MAC", value: "mac_address", sortable: false },
        { text: "Last Update", value: "updated_at", sortable: false },
        { text: "State", sortable: false },
        { text: "Actions", sortable: false }
      ],
      boards: [],
      map: null,
      marker: null
    };
  },
  created() {
    this.getBoards();
  },
  mounted() {
    let myLatLng = new google.maps.LatLng(
      this.$store.state.vitabox.latitude,
      this.$store.state.vitabox.longitude
    );
    this.map = new google.maps.Map(document.getElementById("google-map-box"), {
      zoom: 15,
      center: myLatLng
    });
    this.marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: this.$store.state.vitabox.address
    });
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

<style>
#google-map-box {
  width: 100%;
  height: 400px;
}
</style>
