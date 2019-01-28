<template>
  <div>
    <section>
        <v-layout column align-center>
          <img class="myimg" src="../assets/logo.png">
          <h1 class="white--text mb-2 display-4 font-weight-light text-xs-center">Vitasenior-mt</h1>
          <br>
        </v-layout>
    </section>
  </div>
</template>

<script>
export default {
data: () => {
    return {
      imgsrc:"../assets/logo.png"
    };
  }
};
</script>

<style>
.myimg{
  height: 100px !important;
  width: 100px !important;
}
</style>

