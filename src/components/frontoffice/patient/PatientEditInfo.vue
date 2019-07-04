<template>
  <v-card v-if="patient">
    <v-card-title>
      <span class="headline warning--text">{{ $t("frontoffice.patient.update_info_title") }}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12>
          <v-text-field
            :rules="[() => (patient.name.length > 3 || patient.name.length == 0) || 'Patient name is required']"
            :label="$t('frontoffice.patient.name')"
            v-model="patient.name"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md6>
          <v-select
            :items="genderOptions"
            item-text="name"
            item-value="type"
            :rules="[() => (patient.gender.length > 3 || patient.gender.length == 0) || 'Patient gender is required']"
            :label="$t('frontoffice.patient.gender')"
            v-model="patient.gender"
            single-line
            append-icon="fas fa-angle-down"
          ></v-select>
        </v-flex>
        <v-flex xs12 md6>
          <v-menu
            ref="menu"
            lazy
            :close-on-content-click="false"
            v-model="menu"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            min-width="290px"
            :return-value.sync="patient.birthdate"
          >
            <v-text-field
              slot="activator"
              :label="$t('frontoffice.patient.birthdate')"
              v-model="patient.birthdate"
              append-icon="fas fa-calendar-alt"
              readonly
            ></v-text-field>
            <v-date-picker
              ref="picker"
              v-model="patient.birthdate"
              @change="$refs.menu.save(patient.birthdate)"
              min="1910-01-01"
              :max="new Date().toISOString().substr(0, 10)"
              no-title
              next-icon="fas fa-angle-right"
              prev-icon="fas fa-angle-left"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            mask="#########"
            :rules="[() => (patient.nif.length === 9 || patient.nif.length === 0) || 'Invalid Patient NIF']"
            :label="$t('frontoffice.patient.nif')"
            v-model="patient.nif"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            :rules="[() => (/^[0-9]{8}([ -]*[0-9][ ]*[A-Z]{2}[0-9])*$/.test(patient.cc) || patient.cc.length == 0) || 'Invalid Patient CC']"
            :label="$t('frontoffice.patient.cc')"
            v-model="patient.cc"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field :label="$t('frontoffice.patient.info')" v-model="patient.info"></v-text-field>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        dark
        color="warning darken-1"
        block
        @click.native="save"
      >{{ $t("frontoffice.patient.submit") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data: () => {
    return {
      patient: null,
      dialog_update_patient: false,
      genderOptions: [],
      menu: false
    };
  },
  mounted() {
    this.patient = this.$store.state.patient;
    this.genderOptions = [
      { type: "male", name: this.$t("frontoffice.patient.male") },
      { type: "female", name: this.$t("frontoffice.patient.female") },
      { type: "undefined", name: this.$t("frontoffice.patient.undefined") }
    ];
  },
  watch: {
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    dialog_update_patient(v) {
      console.log(v);
    }
  },
  methods: {
    save() {
      if (
        this.patient.gender.length > 1 &&
        this.patient.name.length > 3 &&
        this.patient.birthdate !== null &&
        this.patient.nif.length === 9 &&
        this.patient.cc.length >= 8
      ) {
        event_bus.$emit("waiting", true);
        event_bus.$data.http
          .put("/patient/" + this.patient.id + "/info", {
            gender: this.patient.gender,
            name: this.patient.name,
            birthdate: this.patient.birthdate,
            nif: this.patient.nif,
            cc: this.patient.cc,
            info: this.patient.info ? this.patient.info : " "
          })
          .then(response => {
            event_bus.$emit("updatePatients");
            event_bus.$emit("toast", {
              message: "patient was successfully updated",
              type: "success"
            });
            this.$store.commit("setPatientData", this.patient);
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
          message: "insert all fields please",
          type: "error"
        });
      }
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>