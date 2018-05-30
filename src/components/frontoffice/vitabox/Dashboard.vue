<template>
  <div style="margin-top:35px">
    <section class="content-header">
      <h1 class="white--text mb-2 display-1 text-xs-left">
        {{$route.name.toUpperCase() }}
        <small>vitasenior</small>
      </h1>
       <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-icon >mdi-home</v-icon><a href="javascript:;">Home</a>
          </v-list-tile-content>
          <v-list-tile-content>
            {{$route.name.toUpperCase()}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </section>
  </div>
</template>


<script>

export default {

}
</script>
<style>

</style>
