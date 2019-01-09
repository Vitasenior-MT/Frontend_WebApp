<template>
  <v-card tile id="vitabox_users">
    
    <v-card-title>
      <span class="headline">Users</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="px-5" id="users_list">
      <v-expansion-panel focusable v-if="users.length>0" popout>
        <v-expansion-panel-content v-for="user in users" :key="user.id" expand-icon="fas fa-caret-down">
          <div slot="header" class="raven--text subheading mb-0"><v-icon v-if="user.sponsor" small>fas fa-crown</v-icon>  {{user.name}}</div>
          <v-card>
            <user-details :user="user" @remove="()=>users.splice(users.indexOf(user), 1)"></user-details>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <div v-else class="subheading text-xs-center warning--text">This vitabox has no users</div>
    </v-card-text>

  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import userDetails from "@/components/backoffice/vitabox/VitaboxUserDetails.vue";

export default {
  name: "vitabox_users",
  props: {
    vitabox: Object
  },
  data: () => {
    return {
      users: []
    };
  },
  created() {
    this.getusers(this.vitabox.id);
  },
  watch: {
    vitabox(val) {
      this.getusers(val.id);
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getusers(vitabox_id) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + vitabox_id + "/user")
        .then(response => {
          this.users = response.data.users;
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
    }
  },
  components: {
    "user-details": userDetails
  }
};
</script>

<style>
#users_list{
  overflow-y: scroll;
  height: 520px;
}
</style>