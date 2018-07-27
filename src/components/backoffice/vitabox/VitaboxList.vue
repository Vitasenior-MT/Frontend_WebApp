<template>
  <v-content id="vitabox_list">

    <v-container class="pl-0 mb-2">
      <v-layout row wrap>
        <v-flex lg2 md3>
          <v-btn color="primary" dark to="/backoffice/vitabox/register">Register Vitabox</v-btn>
        </v-flex>
        <v-flex lg9 md8 offset-md1>
            <v-autocomplete :items="vitaboxes" item-text="address" return-object :search-input.sync="search" v-model="select" prepend-icon="fas fa-search" append-icon="fas fa-angle-down" label="Search" cache-items></v-autocomplete>
        </v-flex>
      </v-layout>
      <br>
      <v-divider></v-divider>
    </v-container>
    <v-card id="select-card">
      <v-layout row wrap v-if="select">
        <v-flex xs12 sm9 md8>
          <table>
            <tr>
              <th class="text-xs-right"><label class="subheading grey--text text--lighten-3 mx-2">id</label></th>
              <th><h3>{{select.id}}</h3></th>
            </tr>
              <tr>
              <th class="text-xs-right"><label class="subheading grey--text text--lighten-3 mx-2">registered</label></th>
              <th>
                <h3 v-if="select.registered"><v-icon>fas fa-check</v-icon></h3>
                <h3 v-else><v-icon>fas fa-times</v-icon></h3>
              </th>
            </tr>
            <tr>
              <th class="text-xs-right"><label class="subheading grey--text text--lighten-3 mx-2">active</label></th>
              <th>
                <h3 v-if="select.active"><v-icon>fas fa-check</v-icon></h3>
                <h3 v-else><v-icon>fas fa-times</v-icon></h3>
              </th>
            </tr>
            <tr>
              <th class="text-xs-right"><label class="subheading grey--text text--lighten-3 mx-2">since</label></th>
              <th><h3>{{select.created_at}}</h3></th>
            </tr>
            <tr>
              <th class="text-xs-right"><label class="subheading grey--text text--lighten-3 mx-2">last alteration</label></th>
              <th><h3>{{select.updated_at}}</h3></th>
            </tr>
          </table>
        </v-flex>
        <v-flex xs12 sm3 md4>
          <v-layout row wrap class=" text-xs-right">
            <v-flex xs4 sm12>
              <v-bottom-sheet v-model="settings_sheet" inset lazy>
                <v-btn slot="activator" color="pink" dark><v-icon>fas fa-cogs</v-icon></v-btn>
                <vitabox-settings @close="settings_sheet=false"></vitabox-settings>
              </v-bottom-sheet>
            </v-flex>
            <v-flex xs4 sm12>
              <v-bottom-sheet v-model="patients_sheet" inset lazy>
                <v-btn slot="activator" color="purple" dark><v-icon>fas fa-users</v-icon></v-btn>
                <vitabox-patients :vitabox="select" @close="patients_sheet=false"></vitabox-patients>
              </v-bottom-sheet>
            </v-flex>
            <v-flex xs4 sm12>
              <v-bottom-sheet v-model="boards_sheet" inset lazy>
                <v-btn slot="activator" color="indigo" dark><v-icon>fas fa-broadcast-tower</v-icon></v-btn>
                <vitabox-boards :vitabox="select" @close="boards_sheet=false"></vitabox-boards>
              </v-bottom-sheet>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <br>
      <div id="google-map-list"></div>
    </v-card>

  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import VitaboxPatients from "@/components/backoffice/patient/PatientList.vue";
import VitaboxBoards from "@/components/backoffice/board/BoardList.vue";
import VitaboxSettings from "@/components/backoffice/vitabox/VitaboxSettings.vue";

export default {
  name: "vitabox_list",
  data: () => {
    return {
      search: "",
      headers: [
        {
          text: "Address",
          align: "left",
          value: "address"
        }
      ],
      select: null,
      vitaboxes: [],
      map: null,
      marker: null,
      patients_sheet: false,
      settings_sheet: false,
      boards_sheet: false
    };
  },
  created() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox")
        .then(response => {
          this.vitaboxes = response.data.vitaboxes;
          this.$store.commit("setVitaboxData", response.data.vitaboxes[0]);
          this.select = response.data.vitaboxes[0];
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
  watch: {
    select(val) {
      this.$store.commit("setVitaboxData", val);
      if (val.latitude && val.longitude) {
        let myLatLng = new google.maps.LatLng(val.latitude, val.longitude);
        this.map = new google.maps.Map(
          document.getElementById("google-map-list"),
          { zoom: 15, center: myLatLng }
        );
        this.marker = new google.maps.Marker({
          position: myLatLng,
          map: this.map,
          title: val.address
        });
      }
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
      let d = new Date(val.created_at);
      this.select.created_at =
        d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
      d = new Date(val.updated_at);
      this.select.updated_at =
        d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
    }
  },
  components: {
    "vitabox-patients": VitaboxPatients,
    "vitabox-settings": VitaboxSettings,
    "vitabox-boards": VitaboxBoards
  }
};
</script>

<style>
th h3 {
  text-align: left;
}
#select-card {
  background-color: transparent;
}
#google-map-list {
  width: 100%;
  height: 250px;
}
</style>