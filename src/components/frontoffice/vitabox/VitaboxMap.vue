<template>
  <div>
    <v-tooltip bottom>
      <v-btn slot="activator" icon @click.native="()=>dialog_vitabox_map=true">
        <v-icon color="cyan">fas fa-map</v-icon>
      </v-btn>
      <span>view map</span>
    </v-tooltip>
    <v-dialog v-model="dialog_vitabox_map">
      <v-card>
        <v-card-title>
          <span class="headline">Vitabox location</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_vitabox_map=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div id="google-map-box"></div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      marker: null,
      dialog_vitabox_map: false
    };
  },
  mounted() {
    console.log(
      this.$store.state.vitabox.latitude,
      this.$store.state.vitabox.longitude
    );
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
  }
};
</script>

<style>
#google-map-box {
  width: 100%;
  height: 500px;
}
</style>
