<template>
    <v-content id="logout">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark>
                <v-toolbar-title>Logout</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-card-actions>
                <v-btn @click="$router.push('/')">
                  Home
                  <v-icon dark right>mdi-home</v-icon>
                </v-btn>
              </v-card-actions>
              </v-card-text>
              
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
</template>

<script>
</script>