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
          <div v-if="dataConnection">
            <div :id="status==3?'cameraBoard':''">
              <video class="invisible" ref="localVideo" autoplay playsinline></video>
              <video class="invisible" ref="remoteVideo" autoplay playinline></video>
            </div>
            <p>{{message}}</p>

            <div v-if="status==0">
              <button @click="this.cancelConnection" color="success">Cancel</button>
            </div>
            <div v-if="status==1">
              <button @click="this.startConnection" color="success">Start</button>
            </div>
            <div v-if="status==2">
              <button @click="this.acceptConnection" color="success">Accept</button>
              <button @click="this.rejectConnection" color="success">Cancel</button>
            </div>
            <div v-if="status==3">
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
      mediaConnection: null,
      dataConnection: null,
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
          ? "vitasenior-peer-test.eu-gb.mybluemix.net"
          : "192.168.161.206",
      port: process.env.NODE_ENV === "production" ? "443" : "8808",
      secure: process.env.NODE_ENV === "production" ? true : false
    });

    this.listenPeerEvent();
  },
  beforeDestroy() {
    if (this.dataConnection) {
      this.dataConnection.close();
    }
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
        if (
          this.status === 2 &&
          this.dataConnection.peer === mediaConnection.peer
        ) {
          this.mediaConnection = mediaConnection;
          this.mediaConnection.answer(this.streamToSend);
          this.status = 3;
          this.message = "";
          this.listenMediaConnection();
        } else {
          dataConnection.send({ type: "unauthorized" });
        }
      });
      this.peer.on("connection", dataConnection => {
        if (this.status === 1) {
          this.dataConnection = dataConnection;
          this.status = 2;
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
      this.message = "";
    },
    selectVitabox(item) {
      this.dataConnection = this.peer.connect("1"); // this.dataConnection = this.peer.connect(item.id);
      this.listenDataConnection();
    },
    startConnection() {
      this.status = 0;
      this.message = "waiting...";
      this.dataConnection.send({
        type: "call",
        username: this.$store.state.user.name
      });
    },
    acceptConnection() {
      this.startCamera().then(success => {
        if (success) {
          this.dataConnection.send({ type: "accept" });
          this.status = 0;
          this.message = "waiting...";
        } else {
          this.dataConnection.send({
            type: "unable",
            message: "camera not working"
          });
          this.status = 1;
          this.message = "";
        }
      });
    },
    rejectConnection() {
      this.dataConnection.send({ type: "reject" });
      this.status = 1;
      this.message = "";
    },
    cancelConnection() {
      this.dataConnection.send({ type: "cancel" });
      this.status = 1;
      this.message = "";
    },
    listenDataConnection() {
      this.dataConnection.on("data", data => {
        switch (data.type) {
          case "call":
            this.status = 2;
            this.message = data.username + " is calling";
            break;
          case "accept":
            this.startCamera().then(success => {
              if (success) {
                this.mediaConnection = this.peer.call(
                  "1", // this.dataConnection.peer,
                  this.streamToSend,
                  { metadata: { user: "Diogo" } }
                );
                this.status = 3;
                this.message = "";
                this.listenMediaConnection();
              } else {
                this.status = 1;
                this.message = "error starting the WebCam";
                this.dataConnection.send({
                  type: "unable",
                  message: "camera not working"
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
      this.dataConnection.on("error", err => {
        console.log("dataConnection error: ", err);
      });
    },
    listenMediaConnection() {
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
