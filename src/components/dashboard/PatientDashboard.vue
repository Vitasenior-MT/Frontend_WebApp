<template>
    <v-container class="px-5">
        <v-list>
            <v-list-tile @click="goToPatientProfile($store.state.patient.id)">
                <v-list-tile-content>
                    <v-list-tile-title>{{ $store.state.patient.name }}</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile @click="goTo">
                <v-list-tile-action>
                    <v-icon>chat</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>60</v-list-tile-title>
                    <v-list-tile-sub-title>BPM</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile @click="()=>{}">
                <v-list-tile-action>
                    <v-icon>chat</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>70</v-list-tile-title>
                    <v-list-tile-sub-title>Kg</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
            <v-list-tile @click="()=>{}">
            <v-list-tile-action>
                <v-icon>chat</v-icon>
            </v-list-tile-action>
                <v-list-tile-content>
                <v-list-tile-title>28</v-list-tile-title>
                <v-list-tile-sub-title>ºC</v-list-tile-sub-title>
            </v-list-tile-content>
            </v-list-tile>
                <v-divider inset></v-divider>
                <v-list-tile @click="()=>{}">
                <v-list-tile-action>
                    <v-icon>chat</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>1562</v-list-tile-title>
                    <v-list-tile-sub-title>callories</v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-container>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "patientDashboard",
    props: {
      selectedPatient: Object
  },
  data() {
    return {
    };
  },
   mounted() {
    this.$store.commit("setPatientData", this.selectedPatient);  
  }
};
</script>

<style>

</style>
