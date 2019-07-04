<template>
  <v-list id="backoffice" class="office_menu">
    <router-link to="/backoffice/vitabox/list">
      <v-list-tile class="office_options office_notchoosen ash--text" @click="select(0)">
        <v-list-tile-action>
          <v-icon>fas fa-tv</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Vitaboxes</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <router-link to="/backoffice/user">
      <v-list-tile class="office_options office_notchoosen ash--text" @click="select(1)">
        <v-list-tile-action>
          <v-icon>fas fa-users</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{$t('navbar.backoffice.users')}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <router-link to="/backoffice/boardmodel">
      <v-list-tile class="office_options office_notchoosen ash--text" @click="select(2)">
        <v-list-tile-action>
          <v-icon>fas fa-broadcast-tower</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{$t('navbar.backoffice.board_models')}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <router-link to="/backoffice/sensormodel">
      <v-list-tile class="office_options office_notchoosen ash--text" @click="select(3)">
        <v-list-tile-action>
          <v-icon>fas fa-microchip</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{$t('navbar.backoffice.sensor_models')}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <router-link to="/backoffice/profilemodel">
      <v-list-tile class="office_options office_notchoosen ash--text" @click="select(4)">
        <v-list-tile-action>
          <v-icon>fas fa-heartbeat</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{$t('navbar.backoffice.profile_models')}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <router-link to="/backoffice/analytics">
      <v-list-tile class="office_options office_notchoosen ash--text" @click="select(5)">
        <v-list-tile-action>
          <v-icon>fas fa-chart-line</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{$t('navbar.backoffice.analytics')}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </router-link>
    <router-link to="/backoffice/utils">
      <v-list-tile class="office_options office_notchoosen ash--text" @click="select(6)">
        <v-list-tile-action>
          <v-icon>fas fa-clipboard</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{$t('navbar.backoffice.utils')}}</v-list-tile-title>
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
    this.select(0);
  },
  methods: {
    select(i) {
      if (this.selected !== -1) {
        document.getElementsByClassName("office_options")[
          this.selected
        ].className = "office_options office_notchoosen ash--text";
      }
      document.getElementsByClassName("office_options")[i].className =
        "office_options";
      this.selected = i;
    }
  }
};
</script>

<style>
.office_notchoosen:hover {
  color: #daf1e7 !important;
}
.office_menu {
  padding-top: 5%;
}
</style>
