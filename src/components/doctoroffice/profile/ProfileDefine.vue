<template>
   <v-expansion-panel id="define_profile" inset>
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary" dark>Define Profile</v-btn>
      </div>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-select :rules="[() => selected !== null || 'Profile model is required']" :items="models" item-text="name" label="Profile" v-model="selected" single-line append-icon="fas fa-angle-down" return-object></v-select>
          </v-flex>
          <v-flex xs12 md2>
            <v-btn dark color="ash" block @click.native="save">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
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
      event_bus.$data.http
        .get("/profilemodel")
        .then(response => {
          this.models = response.data.profiles;
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
        });
    },
    save() {
      if (this.selected) {
        event_bus.$emit("waiting", true);

        let promises = [];

        this.$store.state.patient.Profiles.forEach(profile => {
          let match = this.selected.measures.filter(m => m.tag === profile.tag);
          if (match[0]) {
            profile.min = match[0].min;
            profile.max = match[0].max;
            promises.push(
              new Promise((resolve, reject) => {
                event_bus.$data.http
                  .put(
                    "/patient/" +
                      this.$store.state.patient.id +
                      "/profile/" +
                      profile.id,
                    { min: profile.min, max: profile.max }
                  )
                  .then(response => {
                    this.$store.commit("setProfileData", profile);
                    resolve();
                  })
                  .catch(error => reject());
              })
            );
          }
        });
        Promise.all(promises).then(
          () => {
            event_bus.$emit("waiting", false);
            event_bus.$emit("toast", {
              message: "profiles was successfully updated",
              type: "success"
            });
          },
          error => {
            event_bus.$emit("waiting", false);
            event_bus.$emit("toast", {
              message: "cannot update some profiles",
              type: "error"
            });
          }
        );
      } else {
        event_bus.$emit("toast", {
          message: "insert all fields",
          type: "error"
        });
      }
    }
  }
};
</script>