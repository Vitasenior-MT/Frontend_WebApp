<template>
  <content id="profile_list">
    <v-card dark flat height="100%">
      <v-card-title class="pl-0 py-1">
        <v-spacer></v-spacer>
        <v-text-field
          prepend-icon="fas fa-search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :search="search"
        :items="$store.state.patient.Boards"
        sort-icon="fas fa-angle-down"
        next-icon="fas fa-angle-right"
        prev-icon="fas fa-angle-left"
        :rows-per-page-items="[7]"
        dark
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.Boardmodel.name }}</td>
          <td
            class="text-xs-left"
          >{{ (props.item.schedules && props.item.schedules.length>0) ? props.item.schedules.join(" / ") : "-" }}</td>
          <td
            class="text-xs-left"
          >{{ $tc("frontoffice.patient.every_n_days", props.item.frequency ? props.item.frequency : 0, {days:props.item.frequency}) }}</td>
          <td class="text-xs-right">
            <v-tooltip bottom>
              <v-btn slot="activator" icon class="mx-0" @click="editExam(props.item)">
                <v-icon color="teal">fas fa-edit</v-icon>
              </v-btn>
              <span>{{props.item.schedules? $t('frontoffice.patient.edit_schedule') : $t('frontoffice.patient.schedule_exame')}}</span>
            </v-tooltip>
          </td>
        </template>
        <template slot="no-data">
          <v-alert
            :value="true"
            color="error"
            icon="fas fa-exclamation-triangle"
          >Nothing to display here</v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog_edit_exam" max-width="600px">
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
          text: this.$t("frontoffice.patient.board"),
          value: "Boardmodel.name",
          sortable: true
        },
        {
          text: this.$t("frontoffice.patient.hours"),
          value: "schedules",
          sortable: false
        },
        {
          text: this.$t("frontoffice.patient.frequency"),
          value: "frequecy",
          sortable: false
        },
        {
          text: this.$t("frontoffice.patient.actions"),
          value: "actions",
          sortable: false
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