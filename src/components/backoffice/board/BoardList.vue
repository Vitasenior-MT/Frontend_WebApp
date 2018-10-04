<template>
  <v-card tile id="vitabox_boards">
    
    <v-card-title>
      <span class="headline">Boards</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-card-actions class="py-0">
      <add-board-to-box @update="setBoard"></add-board-to-box>
    </v-card-actions>
    
    <v-card-text class="px-5" id="boards_list">
      <v-expansion-panel focusable v-if="boards.length>0" popout>
        <v-expansion-panel-content v-for="board in boards" :key="board.id" expand-icon="fas fa-caret-down">
          <div slot="header" class="raven--text subheading mb-0">{{board.Boardmodel.name}}<label v-if="board.description"> - </label>{{board.description}}</div>
          <v-card>
            <board-details :board="board" @remove="()=>boards.splice(boards.indexOf(board), 1)"></board-details>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <div v-else class="subheading text-xs-center warning--text">This vitabox has no boards</div>
    </v-card-text>

  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import AddBoard from "@/components/backoffice/board/AddToVitabox.vue";
import BoardDetails from "@/components/backoffice/board/BoardDetails.vue";

export default {
  name: "vitabox_boards",
  props: {
    vitabox: Object
  },
  data: () => {
    return {
      boards: [],
      dialog_remove_board: false,
      temp_board: null
    };
  },
  created() {
    this.getBoards(this.vitabox.id);
  },
  watch: {
    vitabox(val) {
      this.getBoards(val.id);
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    setBoard(item) {
      this.boards.push(item);
      event_bus.$emit("waiting", false);
    },
    getBoards(vitabox_id) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + vitabox_id + "/board")
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
    "add-board-to-box": AddBoard,
    "board-details": BoardDetails
  }
};
</script>

<style>
#boards_list{
  overflow-y: scroll;
  height: 520px;
}
</style>
