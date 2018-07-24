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
          <v-flex xs12>
            <v-text-field :rules="[() => model.name.length > 3 || 'Name is required']" label="Name" v-model="model.name"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field :rules="[() => ['wearable', 'non-wearable', 'environmental'].includes(model.type) || 'Type must be environmental, wearable or non-wearable']" label="Type (wearable, non-wearable, environmental)" v-model="model.type"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field :rules="[() => model.tag.length > 3 || 'Tag is required']" label="Tag (system tag to board)" v-model="model.tag"></v-text-field>
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
      dialog_create_model: false
    };
  },
  methods: {
    save() {
      if (
        this.model.name !== "" &&
        this.model.type !== "" &&
        this.model.tag !== ""
      ) {
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
