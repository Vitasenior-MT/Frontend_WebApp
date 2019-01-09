<template>
  <div>
    <add-board
      v-if="$store.state.vitabox.sponsor"
      :box="$store.state.vitabox"
      @addboard="(board)=>boards.push(board)"
    ></add-board>
    <v-data-table
      :headers="headersBoards"
      :items="boards"
      dark
      sort-icon="fas fa-sort-down"
      next-icon="fas fa-angle-right"
      prev-icon="fas fa-angle-left"
      :rows-per-page-items="[5]"
      no-data-text="no equipment registered on the vitabox"
      expand
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          {{ props.item.Boardmodel.name }}
          <label v-if="props.item.description">-</label>
          {{ props.item.description}}
        </td>
        <td class="text-xs-left">{{ props.item.mac_addr }}</td>
        <td
          class="text-xs-left"
        >{{ new Date(props.item.updated_at).toLocaleDateString("pt-pt", options) }}</td>
        <td class="text-xs-left">
          <disable-board
            v-if="$store.state.vitabox.sponsor"
            :box="$store.state.vitabox"
            :board="props.item"
          ></disable-board>
          <v-icon small v-else-if="props.item.active">fas fa-play</v-icon>
          <v-icon small v-else>fas fa-pause</v-icon>
        </td>
        <td class="text-xs-left layout">
          <update-board v-if="$store.state.vitabox.sponsor" :board="props.item"></update-board>
          <remove-board
            v-if="$store.state.vitabox.sponsor"
            :board="props.item"
            @remove="()=>boards.splice(boards.indexOf(props.item), 1)"
          ></remove-board>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import BoardAdd from "@/components/frontoffice/board/BoardAdd.vue";
import BoardDisable from "@/components/frontoffice/board/BoardDisable.vue";
import BoardUpdate from "@/components/frontoffice/board/BoardUpdate.vue";
import BoardRemove from "@/components/frontoffice/board/BoardRemove.vue";

export default {
  components: {
    "add-board": BoardAdd,
    "disable-board": BoardDisable,
    "remove-board": BoardRemove,
    "update-board": BoardUpdate
  },
  data() {
    return {
      headersBoards: [
        { text: "Board", value: "Boardmodel.name", sortable: true },
        { text: "MAC Address", sortable: false },
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
    }
  }
};
</script>

