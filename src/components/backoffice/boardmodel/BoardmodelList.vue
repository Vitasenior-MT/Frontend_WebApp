<template>
  <v-content id="model_menu">
    <v-card>
      <v-card-title class="pl-0">

        <create-model @new="(val)=>setItem(val)"></create-model>

        <v-spacer></v-spacer>
        <v-text-field prepend-icon="fas fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>

      <v-data-table :headers="headers" :search="search" :items="models" class="elevation-1" sort-icon="fas fa-angle-down" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" :rows-per-page-items="[10]">
        <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.type }}</td>
            <td class="right px-0">
              <v-btn icon class="mx-4" @click.native="getSensors(props.item)"><v-icon>fas fa-microchip</v-icon></v-btn>
              <v-btn icon class="mx-0" @click.native="editItem(props.item)"><v-icon color="secondary">fas fa-edit</v-icon></v-btn>
              <v-btn icon class="mx-0" @click.native="deleteIntention(props.item)"><v-icon color="error">fas fa-minus-circle</v-icon></v-btn>
            </td>
          </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog_edit_board" max-width="500px">
      <edit-model @close="()=>dialog_edit_board=false" @update="(item)=>update(item)" :item="temp_model"></edit-model>
    </v-dialog>

    <v-bottom-sheet v-model="dialog_get_sensors" inset>
      <list-sensors @close="()=>dialog_get_sensors=false" :item="temp_model"></list-sensors>
    </v-bottom-sheet>


    <v-dialog v-model="dialog_remove_board" max-width="500px">
      <delete-model @close="()=>dialog_remove_board=false" @delete="remove" :item="temp_model"></delete-model>
    </v-dialog>

  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import CreateModel from "@/components/backoffice/boardmodel/BoardmodelCreate.vue";
import ListSensorsByModel from "@/components/backoffice/Sensormodel/ListByBoardmodel.vue";
import EditModel from "@/components/backoffice/boardmodel/BoardmodelEdit.vue";
import DeleteModel from "@/components/backoffice/boardmodel/BoardmodelDelete.vue";

export default {
  name: "model_menu",
  data: () => {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        {
          text: "Type",
          align: "left",
          value: "type"
        },
        {
          text: "Actions",
          align: "right",
          value: "id",
          sortable: false
        }
      ],
      models: [],
      dialog_get_sensors: false,
      dialog_edit_board: false,
      dialog_remove_board: false,
      temp_model: null,
      sensors: []
    };
  },
  created() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    } else {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/boardmodel")
        .then(response => {
          this.models = response.data.models;
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
    getSensors(item) {
      this.dialog_get_sensors = true;
      this.temp_model = item;
    },
    setItem(item) {
      this.models.push(item);
      event_bus.$emit("waiting", false);
    },
    editItem(item) {
      this.dialog_edit_board = true;
      this.temp_model = item;
    },
    update(item) {
      this.models[this.models.indexOf(this.temp_model)] = item;
      this.dialog_edit_board = false;
      event_bus.$emit("waiting", false);
    },
    deleteIntention(item) {
      this.dialog_remove_board = true;
      this.temp_model = item;
    },
    remove() {
      this.models.splice(this.models.indexOf(this.temp_model), 1);
      this.dialog_remove_board = false;
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "create-model": CreateModel,
    "delete-model": DeleteModel,
    "list-sensors": ListSensorsByModel,
    "edit-model": EditModel
  }
};
</script>

<style>
</style>
