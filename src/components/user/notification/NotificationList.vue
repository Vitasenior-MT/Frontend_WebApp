<template>
  <v-content>
    <v-toolbar color="primary" dark>
      <v-toolbar-items>
        <v-btn flat @click.native="setPage(-1)" :disabled="page==1">
          <v-icon>fas fa-angle-double-left</v-icon>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-xs-center mx-0">
        <v-icon>fas fa-archive</v-icon>
        <p class="mb-0 subheading">{{ $t('user.notification.notification') }}</p>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click.native="setPage(1)" :disabled="!hasmore">
          <v-icon>fas fa-angle-double-right</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-list dark three-line>
      <v-layout
        class="notificationSelector"
        v-for="(item, index) in notifications"
        :key="index"
        wrap
      >
        <v-flex xs12 class="text-md-left pa-0">
          <v-divider class="vitaboxDivider"></v-divider>
        </v-flex>
        <v-flex xs12 class="text-md-left">
          <v-layout row wrap class="notificationInfo px-3 pt-1">
            <v-flex xs2 sm1 class="text-xs-center">
              <v-icon v-if="item.patient" class="primary_d--text px-1">fa fa-hand-holding-heart</v-icon>
              <v-icon v-else class="primary_d--text px-1">fa fa-tv</v-icon>
            </v-flex>
            <v-flex xs10 sm5>
              <label class="caption primary_l--text">{{ $t('user.notification.to') }}:</label>
              <label class="ash_l--text">{{item.patient!=null?item.patient:item.vitabox}}</label>
            </v-flex>
            <v-flex xs2 sm1 class="text-xs-center">
              <v-icon class="primary_d--text px-1 pt-1">fa fa-calendar</v-icon>
            </v-flex>
            <v-flex xs10 sm5>
              <label class="caption primary_l--text">{{ $t('user.notification.sent') }}:</label>
              <label
                class="ash_l--text"
              >{{ new Date(item.send_date).toLocaleDateString("pt-pt", options) }}</label>
              <br>
              <label class="caption primary_l--text">{{ $t('user.notification.seen') }}:</label>
              <label
                class="ash_l--text"
              >{{ item.check_date?new Date(item.check_date).toLocaleDateString("pt-pt", options):"not seen" }}</label>
            </v-flex>
          </v-layout>

          <v-layout row wrap class="notificationMessage px-3 pb-3 pt-1">
            <v-flex xs2 sm1 class="text-xs-center">
              <span class="primary_l--text caption">{{ $t('user.notification.message') }}:</span>
            </v-flex>
            <v-flex xs10 sm11>
              <span class="subheading white--text">{{ item.message }}</span>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 class="text-md-left pa-0">
          <v-divider class="vitaboxDivider"></v-divider>
        </v-flex>
      </v-layout>
    </v-list>

    <v-btn dark class="ml-0" @click="$router.go(-1)">
      <v-icon>fas fa-long-arrow-alt-left</v-icon>
      <span class="pl-1">{{$t('dashboard.back')}}</span>
    </v-btn>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data() {
    return {
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      },
      notifications: [],
      hasmore: false,
      page: 1
    };
  },
  created() {
    this.getNotifications();
  },
  methods: {
    getNotifications() {
      event_bus.$emit("waiting", true);
      this.notifications = [];
      event_bus.$data.http
        .get("/notification/" + this.page)
        .then(response => {
          this.notifications = response.data.notifications;
          if (this.notifications.length == 25) this.hasmore = true;
          else this.hasmore = false;
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
          if (error.response) {
            event_bus.$emit("toast", {
              message: error.response.data,
              type: "error"
            });
          } else {
            event_bus.$emit("toast", { message: error.message, type: "error" });
          }
          event_bus.$emit("waiting", false);
        });
    },
    setPage(shift) {
      this.page = this.page + shift;
      this.getNotifications();
    }
    // ACABAR ESTA MERDA (PAGINAÇÃO)
  }
};
</script>

<style>
.warningSelector {
  padding-bottom: 0px;
}

.notificationSelector:hover .notificationInfo,
.notificationSelector:hover .notificationMessage {
  background-color: #5b5b5b !important;
}
</style>