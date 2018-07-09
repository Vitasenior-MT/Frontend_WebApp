<template>
  <v-expansion-panel id="add_board_to_patient" popout>
    <v-expansion-panel-content hide-actions>
      <div slot="header" id="add_board_to_patient_header">
        <label class="title">Boards</label>
        <v-btn color="primary" id="add_board_to_patient_icon" class="mt-0" small icon><v-icon>fas fa-plus-circle</v-icon></v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-select :items="boards" v-model="selected" label="Select" hint="Boards to add" item-text="Boardmodel.name" append-icon="fas fa-angle-down" return-object></v-select>
            <v-flex sm4 md3><v-btn block class=" mt-3" dark color="ash" @click.native="save">Save</v-btn></v-flex>
          </v-layout>
        </v-container>
      </v-form>
      
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "add_board_to_patient",
  props: {
    patient: Object,
    box: Object
  },
  data: () => {
    return {
      boards: [],
      selected: null
    };
  },
  mounted() {
    if (this.box) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.box.id + "/board")
        .then(response => {
          this.boards = response.data.boards.filter(
            board => board.Boardmodel.type !== "environmental"
          );
          console.log(this.boards);
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
    } else {
      event_bus.$emit("toast", {
        message: "Patient undefined",
        type: "error"
      });
    }
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
            this.$emit("added", this.selected.id);
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

<style>
#add_board_to_patient_header {
  position: relative;
  display: inline;
}
#add_board_to_patient_icon {
  position: absolute;
  right: 0;
}
</style>