<template>
  <v-content id="auth">
      <v-container fill-height>
        <v-layout justify-center wrap align-center class="pb-5 mb-5">
          <v-flex id="auth_card">
              <login v-if="sw" @forgot="()=>sw=false"></login>
              <forgot v-else @close="()=>sw=true"></forgot>
          </v-flex>
        </v-layout>
      </v-container>
  </v-content>
</template>

<script>
import Login from "./Login.vue";
import Forgot from "./Forgot.vue";

export default {
  name: "auth",
  data: () => {
    return {
      sw: true
    };
  },
  components: {
    login: Login,
    forgot: Forgot
  }
};
</script>

<style>
@media only screen and (orientation: portrait) {
  #auth {
    background-image: url("../../assets/2.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
}
@media only screen and (orientation: landscape) {
  #auth {
    background-image: url("../../assets/1.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
  }
}
#auth_card {
  max-width: 400px;
}
</style>