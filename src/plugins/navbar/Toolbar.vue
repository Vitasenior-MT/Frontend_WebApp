<template>
  <v-toolbar class="primary--text raven" id="top_bar">
    <v-toolbar-title>
      <v-avatar size="25px"><img src="../../assets/logo.png"></v-avatar>Vitasenior
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <v-toolbar-items v-if="logged">
      <v-btn flat dark class="top_bar_item"><v-icon>fas fa-bell</v-icon></v-btn>
    </v-toolbar-items>

    <v-toolbar-items v-else>
      <v-btn flat dark to="/Signin" class="top_bar_item"><v-icon left dark>fas fa-sign-in-alt </v-icon> Signin</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  props: {
    logged: Boolean
  }
}
</script>

<style>
#top_bar {
  height: 56px !important;
}
.top_bar_item{
  height: 56px !important;
}
</style>


