<template >
  <v-layout style="padding-top:15px">
    <v-badge v-model="show" overlap color="red">
      <span slot="badge" >3</span>
      <v-btn color="primary" fab @click="show = !show" :to='"/alerts/list"' style="height:45px">
        <v-icon color="white">fas fa-bell</v-icon>
      </v-btn>
    </v-badge>
  </v-layout>
</template>

<script>
export default {
   data () {
      return {
        show: true
      }
    }
}
</script>

<style>
</style>


