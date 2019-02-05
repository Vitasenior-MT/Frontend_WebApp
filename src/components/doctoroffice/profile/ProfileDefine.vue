<template>
  <v-card id="define_profile">
    <v-card-title>
      <span class="headline primary_d--text">{{ $t('frontoffice.patient.define_profile') }}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="pt-1">
      <v-container grid-list-md>
        <v-select
          :rules="[() => selected !== null || 'Profile model is required']"
          :items="models"
          item-text="name"
          :label="$t('frontoffice.patient.select_profile')"
          v-model="selected"
          single-line
          append-icon="fas fa-angle-down"
          return-object
        ></v-select>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="ash" dark @click.native="save">{{$t('frontoffice.patient.save')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "define_profile",
  data: () => {
    return {
      models: [],
      selected: null
    };
  },
  mounted() {
    this.getProfileModels();
  },
  methods: {
    getProfileModels() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/profilemodel")
        .then(response => {
          this.models = response.data.profiles;
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
    },
    save() {
      if (this.selected) {
        event_bus.$emit("waiting", true);

        let profiles = [];
        this.$store.state.patient.Profiles.forEach(profile => {
          let match = this.selected.measures.filter(m => m.tag === profile.tag);
          if (match[0]) {
            profiles.push({
              id: profile.id,
              min: match[0].min,
              max: match[0].max
            });
          }
        });

        event_bus.$data.http
          .put("/patient/" + this.$store.state.patient.id + "/profile", {
            profiles: profiles,
            description: this.selected.name
          })
          .then(response => {
            this.$store.commit("setProfileData", profiles);
            let patient = this.$store.state.patient;
            patient.profile = this.selected.name;
            this.$store.commit("setPatientData", patient);
            event_bus.$emit("waiting", false);
            event_bus.$emit("toast", {
              message: "profiles was successfully updated",
              type: "success"
            });
            this.close();
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
    close() {
      this.$emit("close");
    }
  }
};
</script>