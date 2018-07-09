<template >
  <v-layout style="padding-top:15px">
    <v-badge v-model="show" overlap color="red">
      <span slot="badge" >3</span>
      <v-btn v-if="!isadmin" color="primary" fab @click="show = !show" :to='"/alerts/list"' style="height:45px">
        <v-icon color="white">fas fa-bell</v-icon>
      </v-btn>
      <v-btn v-else color="primary" fab @click="show = !show" style="height:45px">
        <v-icon color="white">fas fa-bell</v-icon>
      </v-btn>
    </v-badge>
  </v-layout>
</template>

<script>
export default {
  props: { isadmin: Boolean },
  data() {
    return {
      show: true
    };
  }
};
</script>

<style>
</style>


