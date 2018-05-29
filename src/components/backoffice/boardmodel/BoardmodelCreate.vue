<template>
<v-dialog id="create_model" v-model="dialog_create_model" max-width="500px">
  <v-btn color="primary" dark slot="activator" class="mb-2">Create new board model</v-btn>
  <v-card>
    <v-card-title>
      <span class="headline primary_d--text">Add board model</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="()=>dialog_create_model=false">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 md8>
            <v-text-field :rules="[() => model.name.length > 3 || 'Board name is required']" label="Board name" v-model="model.name"></v-text-field>
          </v-flex>
          <v-flex xs12 md4>
            <v-select :rules="[() => model.type.length > 1 || 'Board type is required']" :items="types" label="Board type" v-model="model.type" single-line append-icon="fas fa-angle-down"></v-select>
          </v-flex>
          <v-flex xs12>
            <v-select :rules="[() => model.tag.length > 1 || 'Board equipment is required']" :items="equipments" item-text="name" item-value="tag" label="Board equipment" v-model="model.tag" single-line append-icon="fas fa-angle-down"></v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn dark color="ash" @click.native="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "create_model",
  data: () => {
    return {
      model: {
        id: "",
        name: "",
        type: "",
        tag: ""
      },
      types: ["environmental", "wearable", "non-wearable"],
      equipments: [
        { name: "Zolertia Re-Mote", tag: "zolertiaremote" },
        { name: "MySignals blood pressure", tag: "bloodpressure" },
        { name: "MySignals body temperature", tag: "bodytemperature" },
        { name: "MySignals body pulse", tag: "bodypulse" },
        { name: "MySignals body scale", tag: "bodyscale" },
        { name: "Xiaomi MiBand", tag: "bandfitness" }
      ],
      dialog_create_model: false
    };
  },
  methods: {
    save() {
      if (this.model.name !== "" && this.model.type !== "" && this.model.tag !== "") {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/boardmodel", this.model)
          .then(response => {
            this.model.id = response.data.id;
            this.dialog_create_model = false;
            this.$emit("new", this.model);
            event_bus.$emit("toast", {
              message: "board model was successfully created",
              type: "success"
            });
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
        event_bus.$emit("error", "insert all fields");
      }
    }
  }
};
</script>
