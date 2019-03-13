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
          <v-tooltip v-else bottom>
            <v-icon slot="activator" small v-if="props.item.active">fas fa-play</v-icon>
            <v-icon slot="activator" small v-else>fas fa-pause</v-icon>
            <span>{{props.item.active?$t('frontoffice.board.active'):$t('frontoffice.board.inactive')}}</span>
          </v-tooltip>
        </td>
        <td class="text-xs-left">
          <get-warnings-board v-if="$store.state.vitabox.sponsor" :board="props.item"></get-warnings-board>
          <v-tooltip v-else bottom>
            <v-icon slot="activator" small v-if="props.item.get_warnings">fas fa-play</v-icon>
            <v-icon slot="activator" small v-else>fas fa-pause</v-icon>
            <span>{{props.item.get_warnings?$t('frontoffice.board.active'):$t('frontoffice.board.inactive')}}</span>
          </v-tooltip>
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
import BoardWarning from "@/components/frontoffice/board/BoardWarning.vue";

export default {
  components: {
    "add-board": BoardAdd,
    "disable-board": BoardDisable,
    "remove-board": BoardRemove,
    "update-board": BoardUpdate,
    "get-warnings-board": BoardWarning
  },
  data() {
    return {
      headersBoards: [
        {
          text: this.$t("frontoffice.board.indentification"),
          value: "Boardmodel.name",
          sortable: true
        },
        { text: this.$t("frontoffice.board.mac"), sortable: false },
        { text: this.$t("frontoffice.board.last_update"), sortable: false },
        { text: this.$t("frontoffice.board.state"), sortable: false },
        { text: this.$t("frontoffice.board.warnings"), sortable: false },
        { text: this.$t("frontoffice.board.actions"), sortable: false }
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

