<template>
  <content id="doctor_list">
    <v-card dark flat height="100%">
       <add-doctor v-if="$store.state.vitabox.sponsor"></add-doctor>
        <v-data-table :headers="headersDoctors" :items="$store.state.patient.Doctors" hide-actions class="elevation-1" dark  sort-icon="fas fa-sort-down">
            <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.email }}</td>
                <td class="text-xs-left">{{ new Date(props.item.since).toLocaleDateString("pt-pt", options) }}</td>
                <td class="justify-center layout px-0"></td>
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
import SetDoctor from "@/components/frontoffice/patient/SetDoctor.vue";

export default {
  name: "doctor_list",
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
    headersDoctors: [
        { text: "Doctor", value: "name", sortable: true },
        { text: "Email", sortable: false },
        { text: "Since", sortable: false }
      ]
    };
  },
  components: {
    "add-doctor": SetDoctor
  }
};
</script>
