<template>
  <div id="success_log">
    <v-snackbar
      v-for="option in success_options"
      :key="option.key"
      :color="option.type"
      :timeout="success_log.timeout"
      v-model="option.model"
      :style="'margin-top: '+option.top+'px; z-index:'+option.zindex"
      :top="true"
      :right="true"
    >
      {{ option.message }}
      <v-btn flat @click.native="close(option)">
        <v-icon class="white--text">fas fa-times</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "success_log",
  data: () => {
    return {
      success_options: [],
      success_log: { timeout: 5000, counter: 0 }
    };
  },
  mounted() {
    event_bus.$on("toast", obj => this.send(obj));
  },
  beforeDestroy() {
    event_bus.$off("toast");
  },
  methods: {
    send(obj) {
      this.success_log.counter++;
      this.success_options.push({
        key: this.success_log.counter,
        type: obj.type,
        model: true,
        message: obj.message,
        top: this.success_options.length * 50,
        zindex: 100 - this.success_log.counter,
        timeout: setTimeout(
          () => this.success_options.shift(),
          this.success_log.timeout + 1
        )
      });
    },
    close(option) {
      option.model = false;
      clearTimeout(option.timeout);
      this.success_options.splice(this.success_options.indexOf(option), 1);
    }
  }
};
</script>