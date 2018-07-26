<template>
  <div>
   <add-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" @addboard="(board)=>boards.push(board)"></add-board>
    <v-data-table :headers="headersBoards" :items="boards" hide-actions class="elevation-1" dark sort-icon="fas fa-sort-down">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.Boardmodel.name }}<label v-if="props.item.description"> - </label>{{ props.item.description}}</td>
        <td class="text-xs-left">{{ new Date(props.item.updated_at).toLocaleDateString("pt-pt", options) }}</td>
        <td class="text-xs-left">
          <disable-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :board="props.item"></disable-board>
          <v-icon small v-else-if="props.item.active">fas fa-play</v-icon>
          <v-icon small v-else>fas fa-pause</v-icon>
        </td>
        <td class="layout px-0">
          <v-btn color="primary_d" @click='goToBoardDetails(props.item)'><v-icon>fas fa-info-circle</v-icon></v-btn>
          <remove-board v-if="$store.state.vitabox.sponsor" :box="$store.state.vitabox" :board="props.item" @remove="()=>boards.splice(boards.indexOf(props.item), 1)"></remove-board>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">no data to display here</v-alert>
      </template>
    </v-data-table> 
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import BoardAdd from "@/components/frontoffice/board/BoardAdd.vue";
import BoardDisable from "@/components/frontoffice/board/BoardDisable.vue";
import BoardRemove from "@/components/frontoffice/board/BoardRemove.vue";

export default {
  components: {
    "add-board": BoardAdd,
    "disable-board": BoardDisable,
    "remove-board": BoardRemove
  },
  data() {
    return {
      headersBoards: [
        { text: "Board", value: "Boardmodel.name", sortable: true },
        { text: "Last Update", sortable: false },
        { text: "State", sortable: false },
        { text: "Actions", sortable: false }
      ],
      boards: [],
      options: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      }
    };
  },
  created() {
    this.getBoards();
  },
  methods: {
    getBoards() {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + this.$store.state.vitabox.id + "/board")
        .then(response => {
          this.boards = response.data.boards;
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
    goToBoardDetails(boardData) {
      this.$store.commit("setBoardData", boardData);
      this.$router.push("/frontoffice/board/detail");
    }
  }
};
</script>

