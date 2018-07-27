<template>
  <div id="disable_patient">
    <v-btn icon small color="transparent" @click.native="()=>dialog_set_board=true">
      <v-icon color="primary">fas fa-plus-circle</v-icon>
    </v-btn>

    <v-dialog v-model="dialog_set_board" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline warning--text">Add board to patient</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_set_board=false"><v-icon color="error">fas fa-times</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex sm8 md9><v-select :items="boards" v-model="selected" label="Select board" item-text="Boardmodel.name" append-icon="fas fa-angle-down" return-object></v-select></v-flex>
            <v-flex sm4 md3><v-btn block class=" mt-3" dark color="ash" @click.native="save">Save</v-btn></v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  name: "add_board_to_patient",
  props: {
    patient: Object
  },
  data: () => {
    return {
      boards: [],
      selected: null,
      dialog_set_board: false
    };
  },
  mounted() {
    event_bus.$emit("waiting", true);
    event_bus.$data.http
      .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
      .then(response => {
        this.boards = response.data.boards.filter(
          board => board.Boardmodel.type !== "environmental"
        );
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
  methods: {
    save() {
      if (this.selected !== null) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .post("/board/" + this.selected.id + "/patient", {
            patient_id: this.patient.id
          })
          .then(response => {
            this.$emit("added", this.selected);
            this.dialog_set_board = false;
            event_bus.$emit("waiting", false);
            event_bus.$emit("success", "board was successfully added to user");
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
        event_bus.$emit("toast", {
          message: "insert all fields",
          type: "error"
        });
      }
    }
  }
};
</script>
