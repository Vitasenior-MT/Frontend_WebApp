<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>
      <span>Video Call</span>
      <v-spacer></v-spacer>
      <v-btn icon flat class="my-0" @click="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="cameraBoard">
      <div v-if="status!==4">
        <p class="px-2 headline primary_d--text" style="height:32px;">{{message}}</p>
        <v-divider></v-divider>
      </div>

      <div v-if="status===1">
        <v-list two-line>
          <v-list-tile v-for="item in dataConnections" :key="item.peer">
            <v-list-tile-avatar>
              <v-icon small color="success">fas fa-bullseye</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>{{ item.address }}</v-list-tile-content>
            <v-list-tile-action>
              <v-btn fab dark small color="primary" @click="startConnection(item.connection)">
                <v-icon dark>fas fa-video</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-for="item in offlineVitaboxes" :key="item.id">
            <v-list-tile-avatar>
              <v-icon small color="red">fas fa-bullseye</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>{{ item.address }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </div>

      <div v-if="status==2">
        <div class="buttonsView">
          <v-btn fab dark small color="error" @click="cancelConnection">
            <v-icon dark>fas fa-video-slash</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-if="status==3">
        <div class="buttonsView">
          <v-btn fab dark small color="error" @click="rejectConnection">
            <v-icon dark>fas fa-times</v-icon>
          </v-btn>
          <v-btn fab dark small color="success" @click="acceptConnection">
            <v-icon dark>fas fa-check</v-icon>
          </v-btn>
        </div>
      </div>

      <video class="invisible" ref="remoteVideo" autoplay playinline></video>
      <video class="invisible" ref="localVideo" autoplay playsinline></video>

      <div v-if="status==4">
        <div class="buttonsView">
          <v-btn fab dark small color="error" @click="stopConnection">
            <v-icon dark>fas fa-video-slash</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
    <v-dialog v-model="warningDialog" width="300px">
      <v-card>
        <v-card-title>
          <h3>If you close you'll finish the call</h3>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ash--text" flat @click="warningDialog=false">Cancel</v-btn>
          <v-btn class="error" @click="closeWhileConnection">Finish</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  props: {
    openned: Boolean
  },
  data: function() {
    return {
      streamToSend: null,
      streamToShow: null,
      peer: null,
      remotePeerID: null,
      mediaConnection: null,
      dataConnections: [],
      status: 0,
      message: "initializing...",
      ringing: null,
      warningDialog: null,
      offlineVitaboxes: null
    };
  },
  computed: {
    vitaboxes() {
      return this.$store.state.vitaboxes;
    }
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
  watch: {
    vitaboxes(vitaboxes) {
      // vitaboxes.forEach(vitabox => {
      //   if (!this.dataConnections.find(x => x.peer === vitabox.id)) {
      //     let dataConnection = this.peer.connect(vitabox.id);
      //     dataConnection.on("open", () =>
      //       this.listenDataConnection(dataConnection, vitabox)
      //     );
      //   }
      // });
      //---- dev -----
      if (vitaboxes.length > 0) {
        if (!this.dataConnections.find(x => x.peer === "1")) {
          let dataConnection = this.peer.connect("1");
          dataConnection.on("open", () =>
            this.listenDataConnection(dataConnection, vitaboxes[0])
          );
        }
      }
      //---------------
    },
    dataConnections(dataConnections) {
      // this.offlineVitaboxes = this.vitaboxes.filter(
      //   x => dataConnections.filter(y => y.peer === x.id).length < 1
      // );
      //---- dev -----
      this.offlineVitaboxes = this.vitaboxes.filter(
        x => dataConnections.filter(y => y.peer === "1").length < 1
      );
      //--------------
    }
  },
  beforeDestroy() {
    this.dataConnections.forEach(x => x.connection.close());
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
        if (this.status === 2 && this.remotePeerID === mediaConnection.peer) {
          this.mediaConnection = mediaConnection;
          this.mediaConnection.answer(this.streamToSend);
          this.status = 4;
          this.message = "";
          this.listenMediaConnection();
        } else {
          this.dataConnections.forEach(x => {
            if (x.peer === mediaConnection.peer)
              x.connection.send({ type: "unauthorized" });
          });
        }
      });
      this.peer.on("connection", dataConnection => {
        // let vitabox = this.vitaboxes.filter(x => x.id === dataConnection.peer);
        //---- dev -----^
        let vitabox = this.vitaboxes.filter(
          x => x.id === "ee41fbb1-da23-422d-8b73-26b0fb07fed4"
        );
        //--------------
        this.listenDataConnection(dataConnection, vitabox);
      });
      this.peer.on("error", error => {
        console.log("peer error: ", error.message);
      });
      this.status = 1;
      this.message = "";
    },
    startConnection(connection) {
      if (this.status === 1) {
        this.status = 2;
        this.message = "waiting...";
        this.remotePeerID = connection.peer;
        connection.send({
          type: "call",
          username: this.$store.state.user.name
        });
        this.startCallSound();
      } else this.message = "You're in another call";
    },
    acceptConnection() {
      this.stopCallSound();
      this.status = 2;
      this.message = "waiting...";
      this.startCamera().then(success => {
        if (success)
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID)
              x.connection.send({ type: "accept" });
          });
        else {
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID)
              x.connection.send({
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
      this.stopCallSound();
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.connection.send({ type: "reject" });
      });
      this.status = 1;
      this.message = "";
    },
    cancelConnection() {
      this.stopCallSound();
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.connection.send({ type: "cancel" });
      });
      this.status = 1;
      this.message = "";
    },
    listenDataConnection(dataConnection, vitabox) {
      dataConnection.on("data", data => {
        switch (data.type) {
          case "call":
            if (this.status === 1) {
              // this.remotePeerID = vitabox.id;
              //---- dev -----
              this.remotePeerID = "1";
              //--------------
              this.status = 3;
              this.message =
                data.username + " from " + vitabox.address + " is calling";
              if (!this.openned) this.$emit("open");
              this.startCallSound();
            } else {
              dataConnection.send({ type: "occupied" });
            }
            break;
          case "accept":
            this.startCamera().then(success => {
              if (success) {
                this.stopCallSound();
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
            this.stopCallSound();
            this.status = 1;
            this.message = "the call was rejected";
            break;
          case "occupied":
            this.stopCallSound();
            this.status = 1;
            this.message = "the user is occupied";
            break;
          case "unable":
            this.stopCallSound();
            this.status = 1;
            this.message = "unable to connect: " + data.message;
            break;
          case "unauthorized":
            this.status = 1;
            this.message = "access not allowed";
            break;
          case "cancel":
            this.stopCallSound();
            this.status = 1;
            this.message = "connection canceled";
            break;
        }
      });
      dataConnection.on("error", err => {
        console.log("dataConnection error: ", err);
      });

      // this.dataConnections.push({
      //   connection: dataConnection,
      //   peer: vitabox.id,
      //   address: vitabox.address
      // });

      //---- dev -----
      this.dataConnections.push({
        connection: dataConnection,
        peer: "1",
        address: vitabox.address
      });
      //--------------
    },
    listenMediaConnection() {
      this.mediaConnection.on("stream", stream => {
        this.$refs.localVideo.className = "localView";
        this.$refs.localVideo.srcObject = this.streamToShow;
        this.$refs.remoteVideo.className = "remoteView";
        this.$refs.remoteVideo.srcObject = stream;
      });
      this.mediaConnection.on("close", () => {
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
    startCallSound() {
      let ring = new Audio("/static/owl.mp3");
      this.ringing = setInterval(() => {
        ring.play();
      }, 2000);
    },
    stopCallSound() {
      clearInterval(this.ringing);
    },
    close() {
      if (this.status === 4) {
        this.warningDialog = true;
      } else {
        this.$emit("close");
      }
    },
    closeWhileConnection() {
      this.warningDialog = false;
      this.stopConnection();
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

.cameraBoard {
  position: relative;
  height: 500px;
}

.invisible {
  height: 0;
}

.remoteView {
  position: absolute;
  max-width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.localView {
  position: absolute;
  max-width: 200px;
  bottom: 5%;
  left: 5%;
  z-index: 2;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.buttonsView {
  position: absolute;
  bottom: 7%;
  right: 5%;
}
</style>
