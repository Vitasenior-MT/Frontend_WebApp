<template>
    <div>
        <p>The Vitabox Detail Page</p>
    <br>
    <v-list>
        <v-list-tile>
          <v-list-tile-content>id: {{ $store.state.vitabox.id }}</v-list-tile-content>
          <v-list-tile-content>address: {{ $store.state.vitabox.address }}</v-list-tile-content>
          <v-list-tile-content>registered: {{ $store.state.vitabox.registered }}</v-list-tile-content>
          <v-list-tile-content>active: {{ $store.state.vitabox.active }}</v-list-tile-content>
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
    <v-list-tile v-for="item in boards" :key="item.id">
          <v-list-tile-content>id: {{ item.id }}</v-list-tile-content>
          <v-list-tile-content>location: {{ item.description }}</v-list-tile-content>
          <v-list-tile-content>mac_addr: {{ item.mac_addr }}</v-list-tile-content>
          <v-list-tile-content>active: {{ item.active }}</v-list-tile-content>
          <v-list-tile-content>updated_at: {{ item.updated_at }}</v-list-tile-content>
          <v-list-tile-content> 
              <v-btn @click='goToBoardDetails(item)'>
                <v-icon >mdi-information-outline</v-icon>
              </v-btn>
          </v-list-tile-content>
    </v-list-tile>
    <br>
    <a @click="$router.go(-1)">back</a>
  </div>
</template>

<script>
import GoogleMap from "@/components/Utils/GoogleMap";
import { event_bus } from "@/plugins/bus.js";
export default {
  name: "GoogleMap",
  data() {
    return {
      boards: [],
      center: { lat: null, lng: null },
      markers: [],
      places: []
    };
  },
  created() {
    this.getBoards();
  },
  components: {
    GoogleMap
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
      event_bus.$data.http.get("/vitabox/" + this.$store.state.vitabox.id + "/board").then(response => {
        this.boards = response.data.boards;
      });
    },
    goToBoardDetails(boardData) {
      this.$store.commit("setBoardData", boardData);
      this.$router.push("/board/detail");
    }
  }
};
</script>