<template>
  <v-card tile id="vitabox_settings">
    
    <v-card-title>
      <span class="headline">Settings</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-divider light></v-divider>
      
      <template v-if="this.$store.state.vitabox.settings!==null">
        <code>{{this.$store.state.vitabox.settings}}</code>
        <v-divider light></v-divider>
      </template>
      <div v-else class="subheading text-xs-center warning--text">This vitabox has no settings</div>
      
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "vitabox_settings",
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style>

</style>

