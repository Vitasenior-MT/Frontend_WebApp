<template>
  <content id="profile_list">
    <v-card dark flat height="391">
      <v-card-title  class="pl-0">
        <v-spacer></v-spacer>
        <v-text-field prepend-icon="fas fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :search="search" :items="$store.state.patient.Boards" sort-icon="fas fa-angle-down" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" :rows-per-page-items="[4]" class="pt-2" dark >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.Boardmodel.name }}</td>
          <td class="text-xs-left">{{ props.item.frequency?props.item.frequency:"undefined" }}</td>
          <td class="right layout px-0">
            <v-btn icon class="mx-0" @click="editExam(props.item)">
              <v-icon color="teal">fas fa-edit</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle"> Nothing to display here </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog_edit_exam" max-width="500px">
      <edit-exam @close="()=>dialog_edit_exam=false" :item="selected_exam"></edit-exam>
    </v-dialog>
  </content>
</template>

<script>
import ExamEdit from "@/components/doctoroffice/exam/ExamEdit.vue";

export default {
  name: "profile_list",
  data() {
    return {
      search: "",
      dialog_edit_exam: false,
      selected_exam: null,
      headers: [
        {
          text: "Board",
          value: "Boardmodel.name",
          sortable: true,
          class: "headers"
        },
        {
          text: "Frequency",
          value: "frequecy",
          sortable: false,
          class: "headers"
        }
      ]
    };
  },
  methods: {
    editExam(item) {
      this.selected_exam = item;
      this.dialog_edit_exam = true;
    }
  },
  components: {
    "edit-exam": ExamEdit
  }
};
</script>