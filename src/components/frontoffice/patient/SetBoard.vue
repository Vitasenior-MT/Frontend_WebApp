<template>
  <v-expansion-panel id="add_board_to_patient" popout dark>
    <v-expansion-panel-content hide-actions>

      <div slot="header">
        <v-btn color="primary" dark><v-icon>fas fa-plus</v-icon></v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-select :items="boards" v-model="selected" label="Select" hint="Boards to add" :item-text="(item)=>{return item.description?item.Boardmodel.name+' - '+item.description:item.Boardmodel.name}" prepend-icon="fas fa-stethoscope" append-icon="fas fa-angle-down" return-object></v-select>
            <v-flex sm4 md3><v-btn block class="mt-3" dark color="ash" @click.native="save">Save</v-btn></v-flex>
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
  data: () => {
    return {
      boards: [],
      selected: null
    };
  },
  mounted() {
    event_bus.$emit("waiting", true);
    event_bus.$data.http
      .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
      .then(response => {
        this.boards = response.data.boards.filter(
          board => board.Boardmodel.type === "non-wearable"
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
            patient_id: this.$store.state.patient.id
          })
          .then(response => {
            this.$store.commit("addBoardToPatient", this.selected);
            event_bus.$emit("success", "board was successfully added to user");
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
          message: "insert all fields",
          type: "error"
        });
      }
    }
  }
};
</script>