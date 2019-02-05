<template>
  <v-expansion-panel id="add_board_to_box" inset dark class="mx-0">
    <v-expansion-panel-content hide-actions>
      <div slot="header">
        <v-btn color="primary">
          <v-icon class="pr-2">fas fa-plus</v-icon>
          <label>{{ $t('frontoffice.board.new_device') }}</label>
        </v-btn>
      </div>

      <v-form>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex sm6>
              <v-select
                :items="typeOptions"
                item-text="name"
                item-value="type"
                :label="$t('frontoffice.board.type')"
                v-model="board.type"
                append-icon="fas fa-angle-down"
              ></v-select>
            </v-flex>
            <v-flex sm6>
              <v-select
                v-if="board.type==='wearable'"
                :items="$store.state.patients"
                item-text="name"
                :label="$t('frontoffice.board.select_patient')"
                v-model="selectedPatient"
                append-icon="fas fa-angle-down"
                return-object
              ></v-select>
              <v-text-field
                v-if="board.type==='environmental'"
                :label="$t('frontoffice.board.env_label')"
                v-model="board.description"
              ></v-text-field>
            </v-flex>
            <v-flex sm6>
              <v-text-field
                :mask="'nn:nn:nn:nn:nn:nn:nn:nn'"
                :rules="[() => (board.mac_addr.length > 1 || board.mac_addr.length == 0) || 'Board Mac address is required']"
                :label="$t('frontoffice.board.mac')"
                v-model="board.mac_addr"
                type="text"
              ></v-text-field>
            </v-flex>
            <v-flex sm6>
              <v-text-field
                :rules="[() => (board.password.length > 1 || board.password.length == 0) || 'Board password is required']"
                :label="$t('frontoffice.board.password')"
                v-model="board.password"
                type="password"
                append-icon="fas fa-lock"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn block dark color="ash" @click.native="save">{{$t('frontoffice.board.save')}}</v-btn>
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
        patient_id: "",
        type: ""
      },
      selectedPatient: null,
      typeOptions: []
    };
  },
  mounted() {
    this.typeOptions = [
      { type: "wearable", name: this.$t("frontoffice.board.biometric") },
      { type: "non-wearable", name: this.$t("frontoffice.board.medical") },
      {
        type: "environmental",
        name: this.$t("frontoffice.board.environmental")
      }
    ];
  },
  methods: {
    save() {
      if (
        this.board.mac_addr !== "" &&
        this.board.password !== "" &&
        this.board.type !== "" &&
        ((this.board.type === "environmental" &&
          this.board.description !== "") ||
          this.board.type !== "environmental")
      ) {
        event_bus.$emit("waiting", true);

        if (this.board.type === "wearable") {
          if (this.selectedPatient !== null) {
            this.board.description = this.selectedPatient.name;
            this.board.patient_id = this.selectedPatient.id;
          } else {
            event_bus.$emit("waiting", false);
            event_bus.$emit("toast", {
              message: "select the correct patient",
              type: "error"
            });
            return;
          }
        }
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
          .post("/vitabox/" + this.box.id + "/board", this.board)
          .then(response => {
            response.data.board.description = this.board.description;
            this.$emit("addboard", response.data.board);
            event_bus.$emit("toast", {
              message: "board was successfully added to vitabox",
              type: "success"
            });
            this.board = {
              description: "",
              password: "",
              mac_addr: "",
              type: ""
            };
            event_bus.$emit("waiting", false);
            event_bus.$emit("updatePatients");
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