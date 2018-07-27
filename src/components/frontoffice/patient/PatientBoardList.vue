<template>
  <content id="board_list">
    <v-card dark flat height="100%">
    <add-board v-if="$store.state.vitabox.sponsor"></add-board>  
        <v-data-table :headers="headersBoards" :items="$store.state.patient.Boards" hide-actions class="elevation-1" dark  sort-icon="fas fa-sort-down">
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.Boardmodel.name }}<label v-if="props.item.description"> - </label>{{ props.item.description}}</td>
                <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
            </template>
            <template slot="no-data">
                <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle">
                    No data to display here 
                </v-alert>
            </template>
        </v-data-table>  
    </v-card>
  </content>
</template>

<script>
import SetBoard from "@/components/frontoffice/patient/SetBoard.vue";

export default {
  name: "boardlist",
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
     headersBoards: [
        { text: "Board", value: "Boardmodel.name", sortable: true },
        { text: "Since", sortable: false }
      ]
    };
  },
  components: {
    "add-doctor": SetBoard
  }
};
</script>
