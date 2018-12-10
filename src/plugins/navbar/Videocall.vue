<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Video Call</v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs4>
          <v-list two-line>
            <v-list-tile v-for="item in vitaboxes" :key="item.id" @click="selectVitabox(item.id)">
              <v-list-tile-content>{{ item.address }}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex xs8>
          <div v-if="dataConnections.length>0">
            <div :id="status==4?'cameraBoard':''">
              <video class="invisible" ref="localVideo" autoplay playsinline></video>
              <video class="invisible" ref="remoteVideo" autoplay playinline></video>
            </div>
            <p>{{message}}</p>

            <div v-if="status==1 && selectedPeer!==null">
              <button @click="this.startConnection" color="success">Start</button>
            </div>
            <div v-if="status==2">
              <button @click="this.cancelConnection" color="success">Cancel</button>
            </div>
            <div v-if="status==3">
              <button @click="this.acceptConnection" color="success">Accept</button>
              <button @click="this.rejectConnection" color="success">Cancel</button>
            </div>
            <div v-if="status==4">
              <button @click="this.stopConnection" color="success">Finish</button>
            </div>
            <br>
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
      selectedPeer: null,
      remotePeerID: null,
      mediaConnection: null,
      dataConnections: [],
      status: 0,
      message: "initializing...",
      vitaboxes: this.$store.state.vitaboxes
    };
  },
  mounted() {
    this.peer = Peer(this.$store.state.user.id, {
      key: "8dnMsRvmGdz3fPG8RYO8muaUfQ2Iy1lE",
      host:
        process.env.NODE_ENV === "production"
          ? "vitasenior-peer.eu-gb.mybluemix.net"
          : "192.168.161.206",
      port: process.env.NODE_ENV === "production" ? "443" : "8808",
      secure: process.env.NODE_ENV === "production" ? true : false
    });

    this.listenPeerEvent();
  },
  beforeDestroy() {
    this.dataConnections.forEach(x => x.close());
    if (this.mediaConnection) {
      this.mediaConnection.close();
      this.stopCamera();
    }
    this.peer.destroy();
    this.peer = null;
  },
  methods: {
    listenPeerEvent() {
      this.peer.on("call", mediaConnection => {
        console.log("status on call", this.status);
        if (this.status === 2 && this.remotePeerID === mediaConnection.peer) {
          this.mediaConnection = mediaConnection;
          this.mediaConnection.answer(this.streamToSend);
          this.status = 4;
          this.message = "";
          this.listenMediaConnection();
        } else {
          this.dataConnections.forEach(x => {
            if (x.peer === mediaConnection.peer)
              x.send({ type: "unauthorized" });
          });
        }
      });
      this.peer.on("connection", dataConnection => {
        this.listenDataConnection(dataConnection);
      });
      this.peer.on("error", error => {
        console.log("peer error: ", error.message);
      });
      this.peer.on("disconnected", () => {
        console.log("peer disconnected");
      });
      this.status = 1;
      this.message = "";
    },
    selectVitabox(peer) {
      // this.selectedPeer = peer;
      this.selectedPeer = "1";
      if (!this.dataConnections.find(x => x.peer === peer)) {
        let dataConnection = this.peer.connect(peer);
        this.listenDataConnection(dataConnection);
      }
    },
    startConnection() {
      if (this.status === 1)
        if (this.selectedPeer) {
          this.status = 2;
          this.message = "waiting...";
          this.remotePeerID = this.selectedPeer;
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID)
              x.send({ type: "call", username: this.$store.state.user.name });
          });
        } else this.message = "Vitabox not selected";
      else this.message = "You're in another call";
    },
    acceptConnection() {
      this.status = 2;
      this.message = "waiting...";
      this.startCamera().then(success => {
        if (success)
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID) x.send({ type: "accept" });
          });
        else {
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID)
              x.send({
                type: "unable",
                message: "error starting the WebCam"
              });
          });
          this.status = 1;
          this.message = "error starting the WebCam";
        }
      });
    },
    rejectConnection() {
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.send({ type: "reject" });
      });
      this.status = 1;
      this.message = "";
    },
    cancelConnection() {
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.send({ type: "cancel" });
      });
      this.status = 1;
      this.message = "";
    },
    listenDataConnection(dataConnection) {
      dataConnection.on("data", data => {
        switch (data.type) {
          case "call":
            if (this.status === 1) {
              // this.remotePeerID = dataConnection.peer;
              this.remotePeerID = "1";
              this.status = 3;
              this.message = data.username + " is calling";
            } else {
              dataConnection.send({ type: "occupied" });
            }
            break;
          case "accept":
            this.startCamera().then(success => {
              if (success) {
                console.log("stream to send", this.streamToSend);
                console.log("peer object", this.peer);
                this.mediaConnection = this.peer.call(
                  this.remotePeerID,
                  this.streamToSend
                );
                this.status = 4;
                this.message = "";
                this.listenMediaConnection();
              } else {
                this.status = 1;
                this.message = "error starting the WebCam";
                dataConnection.send({
                  type: "unable",
                  message: "error starting the WebCam"
                });
              }
            });
            break;
          case "reject":
            this.status = 1;
            this.message = "the call was rejected";
            break;
          case "occupied":
            this.status = 1;
            this.message = "the user is occupied";
            break;
          case "unable":
            this.status = 1;
            this.message = "unable to connect: " + data.message;
            break;
          case "unauthorized":
            this.status = 1;
            this.message = "access not allowed";
            break;
          case "cancel":
            this.status = 1;
            this.message = "connection canceled";
            break;
        }
      });
      dataConnection.on("error", err => {
        console.log("dataConnection error: ", err);
      });
      this.dataConnections.push(dataConnection);
    },
    listenMediaConnection() {
      console.log("iniciou escuta de eventos media", this.mediaConnection);

      this.$refs.localVideo.className = "localView";
      this.$refs.localVideo.srcObject = this.streamToShow;
      this.mediaConnection.on("stream", stream => {
        this.$refs.remoteVideo.className = "remoteView";
        this.$refs.remoteVideo.srcObject = stream;
      });
      this.mediaConnection.on("close", () => {
        console.log("mediaConnection closed");
        this.stopCamera();
        this.status = 1;
        this.message = "Call finished";
      });
      this.mediaConnection.on("error", err => {
        console.log("mediaConnection error: ", err);
        this.stopConnection();
      });
    },
    stopConnection() {
      this.mediaConnection.close();
      this.stopCamera();
      this.status = 1;
      this.message = "Call finished";
    },
    async startCamera() {
      try {
        this.streamToSend = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: "user" }
        });
        this.streamToShow = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: "user" }
        });
        return 1;
      } catch (e) {
        return 0;
      }
    },
    stopCamera() {
      if (this.streamToSend)
        this.streamToSend.getTracks().forEach(track => track.stop());
      if (this.streamToShow)
        this.streamToShow.getTracks().forEach(track => track.stop());
      if (this.$refs.remoteVideo.srcObject) {
        this.$refs.remoteVideo.srcObject = null;
        this.$refs.remoteVideo.className = "invisible";
      }
      if (this.$refs.localVideo.srcObject) {
        this.$refs.localVideo.srcObject = null;
        this.$refs.localVideo.className = "invisible";
      }
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
<style>
video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

#cameraBoard {
  position: relative;
  height: 500px;
}
.invisible {
  height: 0;
}
.remoteView {
  position: absolute;
  height: 500px;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.localView {
  position: absolute;
  height: 150px;
  width: 150px;
  bottom: 5%;
  right: 5%;
  z-index: 2;
}
</style>
