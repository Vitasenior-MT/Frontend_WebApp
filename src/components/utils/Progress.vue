<template>
  <div v-if="complete>0" id="progressbar">
        <img id="loadimage" src="../../assets/load2_A.gif">
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "progressbar",
  data: () => {
    return {
      complete: 0
    };
  },
  mounted() {
    event_bus.$on("waiting", val => {
      if (val) this.complete += 1;
      else if (this.complete) this.complete -= 1;
    });
  }
};
</script>

<style>
#progressbar {
  position: absolute;
  top: 0;
  z-index: 1500;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  justify-content: center;
}
#loadimage {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 50%;
  max-width: 100%;
}
</style>
