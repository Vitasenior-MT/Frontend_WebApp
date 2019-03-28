<template>
  <div>
    <v-btn @click.native="openCommandLine" icon>
      <v-icon>fas fa-terminal</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="shell_sheet" inset>
      <v-card tile id="vitabox_shell">
        <v-card-title>
          <span class="headline">SHELL</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="closeCommandLine">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div id="shell_board" @click.stop.prevent="focusEditor">
            <div id="shell_text"></div>
          </div>
          <input
            id="shell_script"
            @keyup.delete="validateBackspace"
            @keyup.enter="sendCommand"
            ref="shell_script"
            v-model="scriptText"
            type="text"
            autofocus
          >
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: "vitabox_shell",
  data: () => {
    return {
      directory: "/home $ ",
      scriptText: "/home $ ",
      shell_sheet: false
    };
  },
  mounted() {},
  methods: {
    openCommandLine() {
      this.shell_sheet = true;
      this.focusEditor();
    },
    closeCommandLine() {
      this.shell_sheet = false;
    },
    validateBackspace() {
      if (!this.scriptText.includes("$ ")) {
        this.scriptText += " ";
      }
    },
    sendCommand() {
      let board = document.getElementById("shell_text");
      let p = document.createElement("P");
      p.innerHTML = this.scriptText;
      p.style.marginBottom = 0;
      board.appendChild(p);
      this.scriptText = this.directory;
    },
    focusEditor() {
      let selection = window.getSelection();
      if (selection.toString().length === 0) {
        this.$refs.shell_script.focus();
      }
    }
  }
};
</script>

<style>
#shell_board {
  width: 100%;
  height: 400px;
  background-color: black;
  color: white;
  position: relative;
}

#shell_script {
  width: 100%;
  background-color: black;
  color: white;
  outline: none;
  padding: 0 5px;
}

#shell_text {
  width: 100%;
  max-height: 400px;
  background-color: black;
  color: white;
  position: absolute;
  bottom: 0;
  overflow-y: auto;
  padding: 0 5px;
}
</style>