<template>
  <content id="profile_list">
    <v-card dark flat height="100%">
      <v-data-table :headers="headersProfiles" :items="$store.state.patient.Profiles" hide-actions class="elevation-1" dark  sort-icon="fas fa-sort-down">
        <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.measure }}</td>
            <td class="text-xs-left">{{ props.item.min }}</td>
            <td class="text-xs-left">{{ props.item.max }}</td>
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

export default {
  name: "profile_list",
  data() {
    return {
      headersProfiles: [
        { text: "Measure", value: "measure", sortable: true },
        { text: "Min", sortable: false },
        { text: "Max", sortable: false }
      ]
    };
  }
};
</script>
