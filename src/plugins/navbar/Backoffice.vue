<template>
  <v-list id="backoffice"  class="office_menu">
    <router-link v-for='(link,index) in links.backoffice' :key='link.name + index' :to='link.path'>
      <v-list-tile class="office_options office_notchoosen ash--text">
        <v-list-tile-action>
          <v-icon v-if="link.icon">{{link.icon}}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="link.name"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
  </v-list>
</template>

<script>
export default {
  name: "backoffice",
  data: () => {
    return {
      selected: -1
    };
  },
  mounted() {
    this.links.backoffice.map((item, index) => {
      if (item.path === this.$route.path) this.select(index);
    });
  },
  watch: {
    $route: function(route) {
      this.links.backoffice.map((item, index) => {
        if (item.path === route.path) this.select(index);
      });
    }
  },
  methods: {
    select(i) {
      if (this.selected !== -1) {
        document.getElementsByClassName("office_options")[this.selected].className =
          "office_options office_notchoosen ash--text";
      }
      document.getElementsByClassName("office_options")[i].className =
        "office_options";
      this.selected = i;
    }
  }
};
</script>