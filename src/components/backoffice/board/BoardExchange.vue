<template>
  <div id="exchange_board">
    <v-btn icon small @click.native="()=>dialog_exchange_board=true" dark color="raven">
      <v-icon small>fas fa-exchange-alt</v-icon>
    </v-btn>
    <v-dialog v-model="dialog_exchange_board" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline error--text">Exchange board</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="()=>dialog_exchange_board=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="board">
          <v-text-field
            :mask="'nn:nn:nn:nn:nn:nn:nn:nn'"
            :rules="[() => mac_addr.length > 1 || 'Board Mac address is required']"
            label="New MAC address"
            v-model="mac_addr"
            type="text"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="ash" block @click.native="exchangeItem">PROCEED</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "exchange_board",
  props: {
    board: Object
  },
  data: () => {
    return {
      dialog_exchange_board: false,
      mac_addr: ""
    };
  },
  mounted() {
    this.mac_addr = this.board.mac_addr;
  },
  methods: {
    exchangeItem() {
      event_bus.$emit("waiting", true);
      if (this.mac_addr.length === 16 || this.mac_addr.length === 12) {
        if (this.mac_addr.length === 16) {
          this.mac_addr =
            this.mac_addr.substring(0, 2) +
            ":" +
            this.mac_addr.substring(2, 4) +
            ":" +
            this.mac_addr.substring(4, 6) +
            ":" +
            this.mac_addr.substring(6, 8) +
            ":" +
            this.mac_addr.substring(8, 10) +
            ":" +
            this.mac_addr.substring(10, 12) +
            ":" +
            this.mac_addr.substring(12, 14) +
            ":" +
            this.mac_addr.substring(14);
        }
        if (this.mac_addr.length === 12) {
          this.mac_addr =
            this.mac_addr.substring(0, 2) +
            ":" +
            this.mac_addr.substring(2, 4) +
            ":" +
            this.mac_addr.substring(4, 6) +
            ":" +
            this.mac_addr.substring(6, 8) +
            ":" +
            this.mac_addr.substring(8, 10) +
            ":" +
            this.mac_addr.substring(10);
        }

        this.dialog_exchange_board = false;

        event_bus.$data.http
          .put("/board/" + this.board.id + "/exchange", {
            mac_addr: this.mac_addr
          })
          .then(response => {
            this.$emit("exchange", this.mac_addr);
            event_bus.$emit("toast", {
              message: "board was successfully exchanged",
              type: "success"
            });
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
          message: "invalid mac address",
          type: "error"
        });
      }
    }
  }
};
</script>