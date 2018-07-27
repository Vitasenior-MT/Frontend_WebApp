<template>
  <v-expansion-panel id="add_board_to_box" inset dark class="mx-0">
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary"><v-icon>fas fa-plus</v-icon></v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex sm6 md4>
              <v-text-field :mask="'nn:nn:nn:nn:nn:nn:nn:nn'" :rules="[() => board.mac_addr.length > 1 || 'Board Mac address is required']" label="MAC address" v-model="board.mac_addr" type="text"></v-text-field>
            </v-flex>
            <v-flex sm6 md4>
              <v-text-field :rules="[() => board.password.length > 1 || 'Board password is required']" label="Password" v-model="board.password"  type="password" append-icon="fas fa-lock"></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field label="(optional) description" v-model="board.description"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn block dark color="ash" @click.native="save">Save</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
      
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "add_board_to_box",
  props: {
    box: Object
  },
  data: () => {
    return {
      board: {
        description: "",
        password: "",
        mac_addr: "",
        id: ""
      }
    };
  },
  methods: {
    save() {
      if (this.board.mac_addr !== "" && this.board.password !== "") {
        event_bus.$emit("waiting", true);
        this.board.mac_addr =
          this.board.mac_addr.substring(0, 2) +
          ":" +
          this.board.mac_addr.substring(2, 4) +
          ":" +
          this.board.mac_addr.substring(4, 6) +
          ":" +
          this.board.mac_addr.substring(6, 8) +
          ":" +
          this.board.mac_addr.substring(8, 10) +
          ":" +
          this.board.mac_addr.substring(10, 12) +
          ":" +
          this.board.mac_addr.substring(12, 14) +
          ":" +
          this.board.mac_addr.substring(14);
        event_bus.$data.http
          .post("/vitabox/" + this.box.id + "/board", this.board)
          .then(response => {
            this.$emit("addboard", response.data.board);
            event_bus.$emit(
              "success",
              "board was successfully added to vitabox"
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
#mac_addr_label {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.54);
}
</style>