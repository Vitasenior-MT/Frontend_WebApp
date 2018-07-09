<template>
  <v-content id="utils_menu">
    <br>
    <v-card>
      <v-layout row wrap>
        <v-flex xs2 class="px-2">
          <v-btn @click="createVitabox" block>Create Vitabox</v-btn>
        </v-flex>
        <v-flex xs10 class="px-2">
         <table>
            <tr>
              <th class="text-xs-right"><label class="caption primary_d--text mx-2">ID</label></th>
              <th class="subheading text-xs-left">{{vitabox.id}}</th>
            </tr>
            <tr>
              <th class="text-xs-right"><label class="caption primary_d--text mx-2">Password</label></th>
              <th class="body-1 text-xs-left">{{vitabox.password}}</th>
            </tr>
          </table>
        </v-flex>
      </v-layout>
    </v-card>
    <br>
    <v-card>
      <v-layout row wrap>
        <v-flex xs2 class="px-2">
          <v-btn @click="createBoard" block>Create Board</v-btn>
        </v-flex>
        <v-flex xs5  class="px-2">
          <v-text-field label="MAC Address" required :mask="'nn:nn:nn:nn:nn:nn:nn:nn'" :rules="[() => !!board.mac_addr || 'This field is required']" v-model="board.mac_addr"></v-text-field>
        </v-flex>
        <v-flex xs5  class="px-2">
          <v-select autocomplete label="Model" :items="models" item-text="name" item-value="id" v-model="board.model" append-icon="fas fa-angle-down"></v-select>
        </v-flex>
        <v-flex xs10 offset-xs2 class="px-2">
          <table>
            <tr>
              <th class="text-xs-right"><label class="caption primary_d--text mx-2">ID</label></th>
              <th class="subheading text-xs-left">{{new_board.id}}</th>
            </tr>
            <tr>
              <th class="text-xs-right"><label class="caption primary_d--text mx-2">MAC address</label></th>
              <th class="subheading text-xs-left">{{new_board.mac_addr}}</th>
            </tr>
            <tr>
              <th class="text-xs-right"><label class="caption primary_d--text mx-2">Password</label></th>
              <th class="body-1 text-xs-left">{{new_board.password}}</th>
            </tr>
          </table>
        </v-flex>
      </v-layout>
    </v-card>
  </v-content>
  
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "utils_menu",
  data: () => {
    return {
      vitabox: {
        id: "c95985ef-fd4f-4035-9023-bd0e280c5912",
        password: "WkN1NNQiRD"
      },
      board: {
        model: "",
        mac_addr: ""
      },
      new_board: Object,
      models: []
    };
  },
  created() {
    if (this.$store.state.user.token === null) {
      this.$router.push("/");
      event_bus.$emit("toast", { message: "Unauthorized", type: "error" });
    }
    event_bus.$data.http
      .get("/boardmodel")
      .then(response => (this.models = response.data.models))
      .catch(error => {
        if (error.response) {
          event_bus.$emit("error", error.response.data);
        } else {
          event_bus.$emit("error", error.message);
        }
      });
  },
  methods: {
    createVitabox() {
      event_bus.$data.http
        .post("/vitabox")
        .then(response => (this.vitabox = response.data))
        .catch(error => {
          if (error.response) {
            event_bus.$emit("error", error.response.data);
          } else {
            event_bus.$emit("error", error.message);
          }
        });
    },
    createBoard() {
      if (this.board.mac_addr !== "") {
        console.log(this.board.mac_addr.length);
        if (this.board.mac_addr.length === 16) {
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
        }
        if (this.board.mac_addr.length === 12) {
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
            this.board.mac_addr.substring(10);
        }
        event_bus.$data.http
          .post("/board", this.board)
          .then(response => {
            this.new_board = response.data;
          })
          .catch(error => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log(error.message);
            }
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
