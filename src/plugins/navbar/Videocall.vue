<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Video Call</v-card-title>

    <v-card-text>
      <div>
        <p>{{message}}</p>
        <video ref="localVideo" autoplay playsinline></video>
        <video ref="remoteVideo" autoplay playinline></video>

        <div v-if="status==1">
          <button @click="this.startConnection" color="success">Start</button>
          <button @click="this.negotiateConnection" color="success">Negotiate</button>
          <br>
        </div>
        <div v-if="status==2">
          <button @click="this.acceptConnection" color="success">Accept</button>
          <button @click="this.rejectConnection" color="success">Cancel</button>
          <br>
        </div>
        <div v-if="status==3">
          <button @click="this.stopConnection" color="success">Finish</button>
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
      mediaConnection: null,
      dataConnection: null,
      status: 0,
      message: ""
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
    this.listenPeerEvent();
  },
  methods: {
    listenPeerEvent() {
      this.peer.on("call", mediaConnection => {
        this.mediaConnection = mediaConnection;
        this.acceptMediaConnection();
      });
      this.peer.on("connection", dataConnection => {
        if (this.status === 1) {
          this.dataConnection = dataConnection;
          console.log("data connection: ", this.dataConnection);
          this.status = 2;
        } else {
          dataConnection.send({ type: "occupied" });
        }
      });
      this.peer.on("error", error => {
        console.log("peer error: ", error.message);
      });
      this.peer.on("disconnected", () => {
        console.log("peer disconnected");
      });

      this.status = 1;
    },
    startDataConnection() {
      this.dataConnection = this.peer.connect(this.remotePeerID);
      this.dataConnection.send({
        type: "call",
        username: this.$store.state.user.name,
        userid: this.$store.state.user.id
      });
      this.status = 2;
    },
    acceptDataConnection() {
      // this.remotePeerID = this.dataConnection;
       this.dataConnection.send({ type: "accept" });
      this.status = 2;
    },
    rejectDataConnection() {
      this.dataConnection.send({ type: "reject" });
      this.status = 1;
    },
    listenDataConnection() {
      this.dataConnection.on("data", data => {
        switch (data.type) {
          case "call":
            this.status = 2;
            this.message = data.username + " is calling";
            break;
          case "accept":
            this.startMediaConnection();
            break;
          case "reject":
            this.status = 1;
            break;
          case "occupied":
            this.status = 1;
            this.message = data.username + "the user is occupied";
            break;
        }
      });
      this.dataConnection.on("error", err => {
        console.log("dataConnection error: ", err);
      });
    },
    startMediaConnection() {
      this.mediaConnection = this.peer.call(
        this.remotePeerID,
        this.streamToSend,
        { metadata: { user: "Diogo" } }
      );
      this.status = 3;
      this.listenMediaConnection();
    },
    acceptMediaConnection() {
      this.mediaConnection.answer(this.streamToSend);
      this.status = 3;
      this.listenMediaConnection();
      this.message = "";
    },
    stopMediaConnection() {
      this.mediaConnection.close();
      this.$refs.remoteVideo.srcObject = null;
      this.$refs.localVideo.srcObject = null;
      this.message = "Call finished";
      this.status = 1;
    },
    rejectMediaConnection() {
      this.mediaConnection.close();
      this.message = "Call refused";
      this.status = 1;
    },
    listenMediaConnection() {
      this.$refs.localVideo.srcObject = this.streamToShow;
      this.mediaConnection.on("stream", stream => {
        this.$refs.remoteVideo.srcObject = stream;
      });
      this.mediaConnection.on("close", () => {
        console.log("mediaConnection closed");
        this.stopConnection();
      });
      this.mediaConnection.on("error", err => {
        console.log("mediaConnection error: ", err);
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
