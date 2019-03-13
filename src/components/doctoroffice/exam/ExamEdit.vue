<template>
  <v-card id="edit_profile" v-if="item">
    <v-card-title>
      <span
        class="headline primary_d--text"
      >{{$t('frontoffice.patient.edit_frequency')}}: {{item.Boardmodel.name}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-text-field
              type="number"
              :rules="[() => (item.frequency >= 0) || 'Invalid value']"
              :label="$t('frontoffice.patient.frequency') + ' (' + $t('dashboard.days') + ')'"
              v-model="item.frequency"
            ></v-text-field>
            <label>{{$t('frontoffice.patient.more_1_hour')}}.</label>
          </v-flex>
          <v-flex v-if="item.schedules" xs12 class="px-0">
            <v-chip v-for="(sch, i) in item.schedules" :key="i">
              {{sch}}h&nbsp;
              <v-icon @click="removeSchedule(i)">fas fa-times</v-icon>
            </v-chip>
          </v-flex>
          <v-flex xs10>
            <v-text-field
              type="number"
              :rules="[() => (parseInt(schedule) < 24 && parseInt(schedule) >= 0) || 'the hours must be between 0 and 24']"
              :label="$t('frontoffice.patient.hours') + ' (0 - 23)'"
              v-model="schedule"
            ></v-text-field>
          </v-flex>
          <v-flex xs2 class="text-xs-right">
            <v-btn
              :disabled="(item.frequency > 1 && (item.schedules && item.schedules.length > 0)) || item.frequency < 1"
              icon
              @click="addSchedule"
            >
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="ash" dark @click.native="save">{{$t('frontoffice.patient.save')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "edit_exam",
  props: {
    item: Object
  },
  data: () => {
    return {
      schedule: 0
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      event_bus.$emit("waiting", true);
      if (!(this.item.frequency > 0)) this.item.schedules = [];
      event_bus.$data.http
        .put("/patient/" + this.$store.state.patient.id + "/exam", {
          board_id: this.item.id,
          schedules: this.item.schedules,
          frequency: this.item.frequency
        })
        .then(response => {
          this.$store.commit("setPatientBoardData", this.item);

          event_bus.$emit("toast", {
            message: "exam was successfully updated",
            type: "success"
          });
          this.close();
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
    addSchedule() {
      if (this.schedule >= 0 && this.schedule < 24) {
        if (!this.item.schedules)
          this.item.schedules = [Math.round(this.schedule)];
        else if (!this.item.schedules.includes(this.schedule))
          this.item.schedules.push(Math.round(this.schedule));
        this.schedule = 0;
      }
    },
    removeSchedule(i) {
      this.item.schedules.splice(i, 1);
    }
  }
};
</script>