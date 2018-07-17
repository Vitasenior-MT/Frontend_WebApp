<template>
  <v-content id="sensor_menu">
    <v-card tile>
      <v-card-title  class="pl-0">
        <create-profile @new="(val)=>setItem(val)"></create-profile>

        <v-spacer></v-spacer>
        <v-text-field prepend-icon="fas fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>
        
      <v-data-table :headers="headers" :search="search" :items="profiles" class="elevation-1" sort-icon="fas fa-angle-down" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" :rows-per-page-items="[10]">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.measures.length }}</td>
          <td><v-btn icon class="mx-0" @click="showMeasures(props.item)"><v-icon color="secondary">fas fa-microchip</v-icon></v-btn></td>
          <td class="right px-0">
            <v-btn icon class="mx-0" @click="editItention(props.item)"><v-icon color="secondary">fas fa-edit</v-icon></v-btn>
            <v-btn icon class="mx-0" @click="deleteItention(props.item)"><v-icon color="error">fas fa-minus-circle</v-icon></v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-bottom-sheet v-model="dialog_measures" inset lazy>
      <profile-measures @close="dialog_measures=false" :item="temp_profile"></profile-measures>
    </v-bottom-sheet>

    <v-dialog v-model="dialog_remove_profile" max-width="500px">
      <delete-profile @close="()=>dialog_remove_profile=false" @delete="remove" :item="temp_profile"></delete-profile>
    </v-dialog>

    <v-dialog v-model="dialog_edit_profile" max-width="500px">
      <edit-profile @close="()=>dialog_edit_profile=false" @update="edit" :item="temp_profile"></edit-profile>
    </v-dialog>

  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import CreateProfile from "@/components/backoffice/profile/ProfileCreate.vue";
import DeleteProfile from "@/components/backoffice/profile/ProfileDelete.vue";
import ProfileMeasures from "@/components/backoffice/profile//ProfileMeasures.vue";
import ProfileEdit from "./ProfileEdit.vue";

export default {
  name: "sensor_menu",
  data: () => {
    return {
      search: "",
      headers: [
        { text: "Name", align: "left", value: "name" },
        { text: "Measures count", align: "left", sortable: false },
        { text: "Measures", align: "left", sortable: false },
        { text: "Actions", align: "right", sortable: false }
      ],
      profiles: [],
      temp_profile: null,
      dialog_remove_profile: false,
      dialog_measures: false,
      dialog_edit_profile: false
    };
  },
  created() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/profilemodel")
        .then(response => {
          this.profiles = response.data.profiles;
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
  methods: {
    showMeasures(item) {
      this.dialog_measures = true;
      this.temp_profile = item;
    },
    setItem(item) {
      this.profiles.push(item);
      event_bus.$emit("waiting", false);
    },
    editItention(item) {
      this.temp_profile = item;
      this.dialog_edit_profile = true;
    },
    edit(item) {
      this.profiles[this.profiles.indexOf(this.temp_profile)] = item;
      this.dialog_edit_profile = false;
      event_bus.$emit("waiting", false);
    },
    deleteItention(item) {
      this.temp_profile = item;
      this.dialog_remove_profile = true;
    },
    remove() {
      this.profiles.splice(this.profiles.indexOf(this.temp_profile), 1);
      this.dialog_remove_profile = false;
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "create-profile": CreateProfile,
    "delete-profile": DeleteProfile,
    "profile-measures": ProfileMeasures,
    "edit-profile": ProfileEdit
  }
};
</script>

<style>
</style>