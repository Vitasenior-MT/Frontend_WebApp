<template>
    <v-content >
        <v-layout row wrap align-center>
            <v-flex xs12 md4>
                <v-card dark flat style="height:70vh;">
                    <div class="text-xs-center">
                        <v-avatar size="150px" style="margin-top:10px">
                            <img
                            class="img-circle elevation-7 mb-1"
                            src="@/assets/logo.png"
                            >
                        </v-avatar>
                        <div class="headline">{{ this.$store.state.patient.name }}</div>
                        <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.id }}</div>
                        <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.birthdate }}</div>
                        <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.gender }}</div>
                        <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.weight }} kg</div>
                        <div class="subheading text-xs-center grey--text pt-1 pb-1">{{ this.$store.state.patient.height }} m</div>
                    </div>
                </v-card>
            </v-flex>
            <v-flex xs12 md8>
                <v-card dark flat style="height:70vh;">
                    <v-data-table
                        :headers="headers"
                        :items="this.$store.state.patient.Profiles"
                        hide-actions
                        class="elevation-1"
                        dark
                        >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-left">{{ props.item.id }}</td>
                            <td class="text-xs-left">{{ props.item.measure }}</td>
                            <td class="text-xs-left">{{ props.item.tag }}</td>
                            <td class="text-xs-left">{{ props.item.min }}</td>
                            <td class="text-xs-left">{{ props.item.max }}</td>
                            <td class="justify-left layout px-0">
                            <v-btn @click='updateProfile(props.item.id)'>
                                <v-icon >fas fa-info-circle</v-icon>
                            </v-btn>
                            </td>
                        </template>
                        <template slot="no-data">
                            <v-alert :value="true" color="error" icon="mdi-alert">
                            Sorry, nothing to display here :(
                            </v-alert>
                        </template>
                    </v-data-table>    
                </v-card>
            </v-flex>
        </v-layout>
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
        { text: "Profile", value: "profile", sortable: false },
        { text: "Measure", value: "measure", sortable: false },
        { text: "TAG", value: "tag", sortable: false },
        { text: "MIN", value: "min", sortable: false },
        { text: "MAX", value: "max", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ]
    };
  },
  components: {},
  created() {
      console.log(this.$store.state.patient.Profiles)
  },
  methods: {}
};
</script>

<style >
</style>
