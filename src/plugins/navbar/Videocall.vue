<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Video Call</v-card-title>

    <v-card-text>
      <div>
        <video ref="localVideo" autoplay playsinline></video>
        <video ref="remoteVideo" autoplay playinline></video>

        <div>
          <button @click="this.tryConnect" color="success">Connect</button>
          <button @click="this.startConnection" color="success">Start</button>
          
          <button @click="this.stopConnection" color="success">Stop</button>
          <br>
        </div>
      </div>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" flat @click="close">close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  data: function() {
    return {
      streamToSend: null,
      streamToShow: null,
      remotePeerID: "1",
      peer: null,
      mediaConnection: null
    };
  },
  mounted: async function() {
    this.peer = Peer(this.$store.state.user.id, {
      key: "8dnMsRvmGdz3fPG8RYO8muaUfQ2Iy1lE",
      host:
        process.env.NODE_ENV === "production"
          ? "vitasenior-peer.eu-gb.mybluemix.net"
          : "192.168.161.206",
      port: process.env.NODE_ENV === "production" ? "443" : "8808",
      secure: process.env.NODE_ENV === "production" ? true : false
    });

    try {
      this.streamToSend = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { height: 300, width: 300 }
      });
      this.streamToShow = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { height: 300, width: 300 }
      });
    } catch (e) {
      console.log("local video error: ", e);
    }

    this.startPeerEventListening();
  },
  methods: {
    startPeerEventListening() {
      this.peer.on("call", mediaConnection => {
        console.log("connection", mediaConnection);
        this.mediaConnection = mediaConnection;
        // console.log("stream", this.streamToSend);
        mediaConnection.answer(this.streamToSend);
        this.$refs.localVideo.srcObject = this.streamToShow;
        this.startConnectionEventListening();
      });

      this.peer.on("open", conn => {
        console.log("peer registred", conn);
      });
      this.peer.on("data", msg => {
        console.log("peer message: ", msg);
      });
      this.peer.on("connection", msg => {
        console.log("peer connected: ", msg);
      });
      this.peer.on("error", error => {
        console.log("peer error: ", error.message);
      });
      this.peer.on("disconnected", () => {
        console.log("peer disconnected");
      });
    },
    async tryConnect() {
      this.peer.connect(this.remotePeerID);
    },
    startConnection() {
      this.mediaConnection = this.peer.call(
        this.remotePeerID,
        this.streamToSend
      );
      this.$refs.localVideo.srcObject = this.streamToShow;
      this.startConnectionEventListening();
    },
    stopConnection() {
      this.$refs.remoteVideo.srcObject = null;
      this.$refs.localVideo.srcObject = null;
      this.mediaConnection.close();
    },
    startConnectionEventListening() {
      this.mediaConnection.on("stream", stream => {
        console.log(stream);
        this.$refs.remoteVideo.srcObject = stream;
      });
      this.mediaConnection.on("close", () => {
        console.log("mediaConnection closed");
        this.stopConnection();
      });
    },

    close() {
      this.streamToSend.getTracks().forEach(track => track.stop());
      this.streamToShow.getTracks().forEach(track => track.stop());
      this.peer.destroy();
      this.peer = null;
      this.$emit("close");
    }
  }
};
</script>
<style>
img,
video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
