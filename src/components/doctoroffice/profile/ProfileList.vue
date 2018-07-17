<template>
  <div id="profile_list">
    <v-card dark flat height="100%">
      <v-data-table :headers="headers" :items="$store.state.patient.Profiles" hide-actions class="elevation-1" dark >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.id }}</td>
          <td class="text-xs-left">{{ props.item.measure }}</td>
          <td class="text-xs-left">{{ props.item.min }}</td>
          <td class="text-xs-left">{{ props.item.max }}</td>
          <td class="justify-center layout px-0">
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
    <define-profile @close="()=>dialog_define_profile=false"></define-profile>
  </div>
</template>

<script>
import ProfileEdit from "@/components/doctoroffice/profile/ProfileEdit.vue";
import ProfileDefine from "@/components/doctoroffice/profile/ProfileDefine.vue";

export default {
  name: "profile_list",
  data() {
    return {
      dialog_edit_profile: false,
      selected_profile: null,
      headers: [
        {
          text: "Profile",
          value: "profile",
          sortable: false,
          class: "headers"
        },
        {
          text: "Measure",
          value: "measure",
          sortable: false,
          class: "headers"
        },
        { text: "Min", value: "min", sortable: false, class: "headers" },
        { text: "Max", value: "max", sortable: false, class: "headers" },
        { text: "Actions", value: "actions", sortable: false, class: "headers" }
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
