<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Video Call</v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs4>
          <v-list two-line>
            <v-list-tile v-for="item in vitaboxes" :key="item.id" @click="selectVitabox(item)">
              <v-list-tile-content>{{ item.address }}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs8>
          <div v-if="selectedVitabox">
            <p>{{message}}</p>
            <video ref="localVideo" autoplay playsinline></video>
            <video ref="remoteVideo" autoplay playinline></video>

            <div v-if="status==0">Initiating...
              <br>
            </div>
            <div v-if="status==1">
              <button @click="this.startConnection" color="success">Start</button>
              <br>
            </div>
            <div v-if="status==2">Waiting...
              <br>
            </div>
            <div v-if="status==3">
              <button @click="this.acceptConnection" color="success">Accept</button>
              <button @click="this.rejectConnection" color="success">Cancel</button>
              <br>
            </div>
            <div v-if="status==4">
              <button @click="this.stopConnection" color="success">Finish</button>
              <br>
            </div>
          </div>
        </v-flex>
      </v-layout>
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
      peer: null,
      mediaConnection: null,
      dataConnection: null,
      status: 0,
      message: "",
      vitaboxes: this.$store.state.vitaboxes,
      selectedVitabox: null
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
        if (this.status === 2 && this.remotePeerID === mediaConnection.peer) {
          this.mediaConnection = mediaConnection;
          this.mediaConnection.answer(this.streamToSend);
          this.listenMediaConnection();
          this.status = 4;
          this.message = "";
        } else {
          dataConnection.send({ type: "unauthorized" });
        }
      });
      this.peer.on("connection", dataConnection => {
        if (this.status === 1) {
          console.log(dataConnection);
          this.dataConnection = dataConnection;
          this.status = 2;
          console.log(this.dataConnection);
          this.listenDataConnection();
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
    selectVitabox(item) {
      this.selectedVitabox = item;
      // this.dataConnection = this.peer.connect(this.selectedVitabox.id);
      this.dataConnection = this.peer.connect("1");
      this.listenDataConnection();
    },
    startConnection() {
      this.status = 2;
      this.dataConnection.send({
        type: "call",
        username: this.$store.state.user.name
      });
      console.log("invite sent");
    },
    acceptConnection() {
      console.log("perr: ", this.dataConnection.peer);
      this.remotePeerID = this.dataConnection.peer;
      this.dataConnection.send({ type: "accept" });
      this.status = 2;
      console.log("accept invite");
    },
    rejectConnection() {
      this.dataConnection.send({ type: "reject" });
      this.status = 1;
      console.log("reject invite");
    },
    listenDataConnection() {
      console.log("entrou no listenDataConnection");
      this.dataConnection.on("data", data => {
        console.log("data: ", data);
        switch (data.type) {
          case "call":
            this.message = data.username + " is calling";
            this.status = 3;
            break;
          case "accept":
            this.mediaConnection = this.peer.call(
              // this.selectedVitabox.id,
              "1",
              this.streamToSend,
              { metadata: { user: "Diogo" } }
            );
            this.status = 4;
            console.log("invite accepted");
            this.listenMediaConnection();
            break;
          case "reject":
            this.message = "the call was rejected";
            this.status = 1;
            break;
          case "occupied":
            this.message = "the user is occupied";
            this.status = 1;
            break;
        }
      });
      this.dataConnection.on("error", err => {
        console.log("dataConnection error: ", err);
      });
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
    stopConnection() {
      this.mediaConnection.close();
      this.$refs.remoteVideo.srcObject = null;
      this.$refs.localVideo.srcObject = null;
      this.message = "Call finished";
      this.status = 1;
    },
    close() {
      // this.streamToSend.getTracks().forEach(track => track.stop());
      // this.streamToShow.getTracks().forEach(track => track.stop());
      // this.peer.destroy();
      // this.peer = null;
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
