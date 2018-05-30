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
      <add-board-to-box :box="item" @update="(board)=>setBoard(board)"></add-board-to-box>
    </v-card-actions>
    
    <v-card-text class="px-5">
      <v-divider light></v-divider>

      <v-list v-if="boards.length>0">
        <router-link v-for="board in boards" :key="board.id" :to="{name: 'BoardDashboard', params: { board:board, box:item } }">
          <v-list-tile two-line @click="()=>{}">
            <v-list-tile-content>
              <v-list-tile-title class="raven--text">{{board.Boardmodel.name}} - {{board.description}}</v-list-tile-title>
              <v-list-tile-sub-title>{{board.Boardmodel.type}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon v-if="board.active" color="secondary">fas fa-plug</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </router-link>
      </v-list>

      <div v-else class="subheading text-xs-center warning--text">This vitabox has no boards</div>
    </v-card-text>

  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import AddBoard from "@/components/backoffice/board/AddToVitabox.vue";

export default {
  name: "vitabox_boards",
  props: {
    item: Object
  },
  data: () => {
    return {
      boards: [],
      dialog_remove_board: false,
      temp_board: null
    };
  },
  created() {
    event_bus.$emit("waiting", true);
    event_bus.$data.http
      .get("/vitabox/" + this.item.id + "/board")
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
  },
  watch: {
    item(val) {
      event_bus.$emit("waiting", true);
      event_bus.$data.http
        .get("/vitabox/" + val.id + "/board")
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
  methods: {
    close() {
      this.$emit("close");
    },
    setBoard(item) {
      this.boards.push(item);
      event_bus.$emit("waiting", false);
    }
  },
  components: {
    "add-board-to-box": AddBoard
  }
};
</script>