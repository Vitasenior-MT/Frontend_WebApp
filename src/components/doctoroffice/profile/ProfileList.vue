<template>
  <content id="profile_list">
    <v-card dark flat height="100%">
      <v-card-title  class="pl-0">
        <v-btn color="primary" dark @click="()=>dialog_define_profile=true" class="mb-2">Define Profile</v-btn>
        <v-spacer></v-spacer>
        <v-text-field prepend-icon="fas fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :search="search" :items="$store.state.patient.Profiles" sort-icon="fas fa-angle-down" next-icon="fas fa-angle-right" prev-icon="fas fa-angle-left" :rows-per-page-items="[4]" class="pt-2" dark >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.measure }}</td>
          <td class="text-xs-left">{{ props.item.min }}</td>
          <td class="text-xs-left">{{ props.item.max }}</td>
          <td class="right layout px-0">
            <v-btn icon class="mx-0" @click="editProfile(props.item)">
              <v-icon color="teal">fas fa-edit</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="fas fa-exclamation-triangle"> Nothing to display here </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog_edit_profile" max-width="500px">
      <edit-profile @close="()=>dialog_edit_profile=false" :item="selected_profile"></edit-profile>
    </v-dialog>
    <v-dialog v-model="dialog_define_profile" max-width="500px">
      <define-profile @close="()=>dialog_define_profile=false"></define-profile>
    </v-dialog>
  </content>
</template>

<script>
import ProfileEdit from "@/components/doctoroffice/profile/ProfileEdit.vue";
import ProfileDefine from "@/components/doctoroffice/profile/ProfileDefine.vue";

export default {
  name: "profile_list",
  data() {
    return {
      search: "",
      dialog_edit_profile: false,
      dialog_define_profile: false,
      selected_profile: null,
      headers: [
        {
          text: "Measure",
          value: "measure",
          sortable: true,
          class: "headers"
        },
        { text: "Min", value: "min", sortable: false, class: "headers" },
        { text: "Max", value: "max", sortable: false, class: "headers" },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "headers",
          align: "right"
        }
      ]
    };
  },
  methods: {
    editProfile(item) {
      this.selected_profile = item;
      this.dialog_edit_profile = true;
    }
  },
  components: {
    "edit-profile": ProfileEdit,
    "define-profile": ProfileDefine
  }
};
</script>
