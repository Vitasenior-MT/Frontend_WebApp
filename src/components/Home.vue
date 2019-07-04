<template>
  <v-layout column justify-center wrap align-center id="pannel">
    <img id="banner" src="../assets/banner.png">
    <br>
    <v-btn
      @click="installer"
      :style="installed?'display: none;':'display: block;'"
      :disabled="installed"
    >{{installed?'instalado':'instalar'}}</v-btn>
  </v-layout>
</template>

<script>
export default {
  data: () => {
    return {
      imgsrc: "../assets/logo.png",
      installed: true,
      installer: undefined
    };
  },
  created() {
    let installPrompt;

    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      installPrompt = e;
      this.installed = false;
    });

    this.installer = () => {
      this.installed = true;
      installPrompt.prompt();
      installPrompt.userChoice.then(result => {
        if (result.outcome === "accepted") console.log("User accepted");
        else console.log("User denied");
        installPrompt = null;
      });
    };
  }
};
</script>

<style>
#banner {
  width: 100%;
  max-height: 900px;
  max-width: 900px;
  object-fit: contain;
}
#pannel {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../assets/fotoLar.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100%;
}
</style>

