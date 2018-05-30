<template>
    <div class="text-md-center" style="margin-top: 70px">
        <h2>User Profile</h2>
        <v-layout>
            <v-flex xs6 offset-xs3>
                <v-card>
                    <v-btn class="mb-3" success @click.native='changepass'>Change Password</v-btn>
                </v-card>
                <v-card>
                    <v-btn class="mb-3" success @click='updatephoto'>Update Photo</v-btn>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>


<script>
import { event_bus } from "@/plugins/bus.js";
export default {
  methods: {
      changepass(){
          this.$router.push("changepass");
      },
      updatephoto(){
          this.$router.push("updatephoto");
      },
  }
};
</script>