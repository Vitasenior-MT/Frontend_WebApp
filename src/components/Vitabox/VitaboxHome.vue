<template>
  <div style="margin-top: 80px;">
    <v-data-table
      :headers="headers"
      :items="vitaboxes"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.id }}</td>
        <td class="text-xs-left">{{ props.item.address }}</td>
        <td class="text-xs-left"  v-if="props.item.registered === true"><v-icon>mdi-check</v-icon></td>
        <td class="text-xs-left"  v-if="props.item.registered === false"><v-icon>mdi-close</v-icon></td>
        <td class="text-xs-left"  v-if="props.item.active === true"><v-icon>mdi-check</v-icon></td>
        <td class="text-xs-left"  v-if="props.item.active === false"><v-icon>mdi-close</v-icon></td>
        <td class="justify-left layout px-0">
          <v-btn @click='goToVitaboxDetails(props.item)'>
            <v-icon >mdi-information-outline</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="mdi-alert">
          Sorry, nothing to display here :(
        </v-alert>
      </template>
    </v-data-table>
    <v-flex style="margin-bottom: 40px">
      <v-btn @click="$router.go(-1)">
            <v-icon >mdi-keyboard-return</v-icon>
      </v-btn>
    </v-flex>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  data() {
    return {
      headers: [
        { text: "Id", value: "id", sortable: false },
        { text: "Location", value: "address", sortable: false },
        { text: "Registered?", value: "registered", sortable: false },
        { text: "Active?", value: "active", sortable: false },
        { text: "Details", value: "name", sortable: false }
      ],
      vitaboxes: []
    };
  },
  created() {
    this.getVitaboxes();
  },
  methods: {
    getVitaboxes() {
      event_bus.$data.http
        .get("/vitabox")
        .then(response => {
          this.vitaboxes = response.data.vitaboxes;
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
        });
    },
    goToVitaboxDetails(vitaboxData) {
      this.$store.commit("setVitaboxData", vitaboxData);
      this.$router.push("/vitabox/detail");
    }
  }
};
</script>