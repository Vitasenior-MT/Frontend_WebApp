<template>
  <v-content id="vitabox_create">
    <br>
    <v-card class="vitabox_register_form">
      <v-layout row wrap>
        <v-flex md6>
            <v-card-text>
              <v-text-field :mask="'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn'" :rules="[() => id.length > 1 || 'Vitabox ID is required']" label="ID" v-model="id" type="text"></v-text-field>
              <v-text-field :rules="[() => email.length > 1 || 'Vitabox sponsor email is required']" name="email" v-model="email" label="Sponsor email"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn dark color="ash" @click="register">Register</v-btn>
            </v-card-actions>
          </v-flex>
          <v-flex md6>
            <v-card-text>
              <v-text-field :rules="[() => address.length > 1 || 'Vitabox address is required']" name="address" v-model="address" label="Address" multi-line></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
      </v-card>
      <div id="google-map-register"></div>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "vitabox_create",
  data: () => {
    return {
      id: "",
      address: "",
      email: "",
      map: null,
      marker: null
    };
  },
  mounted() {
   if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      const element = document.getElementById("google-map-register");
      const options = {
        zoom: 15,
        center: new google.maps.LatLng(39.6027245, -8.4039402)
      };
      this.map = new google.maps.Map(element, options);
      google.maps.event.addListener(this.map, "click", event =>
        this.setMarker(event.latLng)
      );
    }
  },
  methods: {
    register() {
      if (
        this.email !== "" &&
        this.email.includes("@") &&
        this.id !== "" &&
        this.address !== "" &&
        this.marker !== null
      ) {
        event_bus.$emit("waiting", true);
        this.id =
          this.id.substring(0, 8) +
          "-" +
          this.id.substring(8, 12) +
          "-" +
          this.id.substring(12, 16) +
          "-" +
          this.id.substring(16, 20) +
          "-" +
          this.id.substring(20, 32);
        event_bus.$data.http
          .post("/vitabox/" + this.id + "/register", {
            latitude: this.marker.getPosition().lat(),
            longitude: this.marker.getPosition().lng(),
            address: this.address,
            email: this.email
          })
          .then(response => {
            event_bus.$emit("success", "vitabox was successfully registered");
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
      } else {
        event_bus.$emit("error", "insert all the fields and the marker at map");
      }
    },
    setMarker(location) {
      if (this.marker !== null) {
        this.marker.setMap(null);
      }
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map
      });
    }
  }
};
</script>

<style>
#google-map-register {
  width: 100%;
  height: 300px;
  margin: 0 auto;
  background-color: transparent;
}
.vitabox_register_form {
  background-color: transparent;
}
</style>

        