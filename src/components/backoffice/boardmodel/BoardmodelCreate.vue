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
        <v-select :rules="[() => model.tag.length > 1 || 'Board equipment is required']" :items="equipments" item-text="name" label="Board equipment" v-model="model" single-line append-icon="fas fa-angle-down" return-object></v-select>
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
      equipments: [
        {
          name: "Zolertia Re-Mote",
          tag: "zolertiaremote",
          type: "environmental"
        },
        {
          name: "Pressão Arterial",
          tag: "bloodpressure",
          type: "non-wearable"
        },
        {
          name: "Temperatura",
          tag: "bodytemperature",
          type: "non-wearable"
        },
        {
          name: "Pulsometro",
          tag: "bodypulse",
          type: "non-wearable"
        },
        {
          name: "Balança",
          tag: "bodyscale",
          type: "non-wearable"
        },
        {
          name: "Bracelete",
          tag: "bandfitness",
          type: "wearable"
        }
      ],
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
