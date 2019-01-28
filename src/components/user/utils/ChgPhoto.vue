<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{title}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="close">
        <v-icon color="error">fas fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-responsive>
      <v-container fill-height class="pa-0">
        <v-layout justify-center align-center>
          <div id="img-board">
            <img id="img-comp" v-if="selectedImage" :src="selectedImage">
          </div>
        </v-layout>
      </v-container>
    </v-responsive>
    <v-card-text>
      <label v-if="selectedImage">selected file: {{selectedFilename}}</label>
    </v-card-text>
    <v-card-actions>
      <input type="file" name="image" @change="onFileChanged" id="file" class="inputfile">
      <div class="primary white--text">
        <label for="file">Choose a file</label>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="uploadImage">Upload</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";
import html2canvas from "html2canvas";

export default {
  props: {
    to_patient: Boolean
  },
  data() {
    return {
      title: "",
      selectedImage: null,
      height: 0,
      width: 0,
      cropPreview: null,
      imgBoard: null,
      dragging: false,
      selectedFilename: ""
    };
  },
  mounted() {
    if (!this.to_patient)
      if (this.$store.state.user.photo) {
        this.title = "Change your Photo";
      } else {
        this.title = "Define your Photo";
      }
    else if (this.$store.state.patient.photo) {
      this.title = "Change " + this.$store.state.patient.name + "'s Photo";
    } else {
      this.title = "Define " + this.$store.state.patient.name + "'s Photo";
    }
  },
  methods: {
    onFileChanged(event) {
      this.selectedImage = event.target.files[0];
      this.compress(event);
    },
    uploadImage() {
      event_bus.$emit("waiting", true);
      html2canvas(this.cropPreview).then(canvas => {
        canvas.toBlob(blob => {
          let formData = new FormData();
          formData.append("image", blob, this.selectedFilename);
          if (!this.to_patient)
            event_bus.$data.http
              .post("/photo", formData)
              .then(response => {
                let user = this.$store.state.user;
                user.photo = response.data.filename;
                this.$store.commit("setUserData", user);
                this.$emit("changed");
                event_bus.$emit("waiting", false);
              })
              .catch(err => {
                if (error.response) {
                  event_bus.$emit("toast", {
                    message: error.response.data,
                    type: "error"
                  });
                } else {
                  event_bus.$emit("toast", {
                    message: error.message,
                    type: "error"
                  });
                }
                event_bus.$emit("waiting", false);
              });
          else
            event_bus.$data.http
              .post(
                "/patient/" + this.$store.state.patient.id + "/photo",
                formData
              )
              .then(response => {
                let patient = this.$store.state.patient;
                patient.photo = response.data.filename;
                this.$store.commit("setPatientData", patient);
                this.$emit("changed");
                event_bus.$emit("waiting", false);
              })
              .catch(err => {
                if (error.response) {
                  event_bus.$emit("toast", {
                    message: error.response.data,
                    type: "error"
                  });
                } else {
                  event_bus.$emit("toast", {
                    message: error.message,
                    type: "error"
                  });
                }
                event_bus.$emit("waiting", false);
              });
        });
      });
    },
    compress(e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          this.width = 200;
          this.height = Math.round((this.width / img.width) * img.height);
          this.selectedImage = event.target.result;
          this.selectedFilename = e.target.files[0].name;
          this.showCrop();
        };
      };
      reader.onerror = error => console.log(error);
    },
    close() {
      this.$emit("close");
    },
    showCrop() {
      if (!this.cropPreview) {
        this.imgBoard = document.getElementById("img-comp");
        this.cropPreview = document.createElement("DIV");
        this.cropPreview.setAttribute("id", "img-crop");
        this.imgBoard.parentElement.insertBefore(
          this.cropPreview,
          this.imgBoard
        );
        /*execute a function when someone moves the crop over the image:*/
        this.cropPreview.addEventListener(
          "mousedown",
          () => (this.dragging = true)
        );
        this.cropPreview.addEventListener(
          "mouseup",
          () => (this.dragging = false)
        );
        this.cropPreview.addEventListener("mousemove", e =>
          this.moveCrop(e, false)
        );
        /*and also for touch screens:*/
        this.cropPreview.addEventListener("touchmove", e =>
          this.moveCrop(e, true)
        );

        this.cropPreview.style.backgroundRepeat = "no-repeat";
        this.cropPreview.style.backgroundSize =
          this.width + "px " + this.height + "px";
        this.cropPreview.style.border = this.to_patient
          ? "2px solid #424242;"
          : "2px solid #212120";
        this.cropPreview.style.backgroundColor = this.to_patient
          ? "#424242"
          : "#212120";
      }
      /*set background properties for the crop:*/
      this.cropPreview.style.backgroundImage =
        "url('" + this.selectedImage + "')";
    },
    moveCrop(e, touch) {
      if (this.dragging || touch) {
        let w = 90;
        let h = 90;
        /*prevent any other actions that may occur when moving over the image*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        let a,
          x = 0,
          y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = this.imgBoard.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        /*prevent the crop from being positioned outside the image:*/
        if (x > this.width - w) {
          x = this.width - w;
        }
        if (x < w) {
          x = w;
        }
        if (y > this.height - h) {
          y = this.imgBoard.height - h;
        }
        if (y < h) {
          y = h;
        }
        /*set the position of the crop:*/
        this.cropPreview.style.left = x - w + "px";
        this.cropPreview.style.top = y - h + "px";
        this.cropPreview.style.backgroundPosition =
          "-" + (x - w) + "px -" + (y - h) + "px";
      }
    }
  }
};
</script>

<style>
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile + div {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  padding: 0 16px;
  align-items: center;
  border-radius: 2px;
  display: inline-flex;
  height: 36px;
  flex: 0 1 auto;
  font-size: 14px;
  font-weight: 500;
  justify-content: center;
  min-width: 88px;
  outline: 0;
  text-transform: uppercase;
  text-decoration: none;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), color 1ms ease;
  position: relative;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer !important;
}

.inputfile + div label {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  flex: 1 0 auto;
  user-select: none;
  cursor: pointer;
}

#img-board {
  position: relative;
  width: 200px;
  height: auto;
}

#img-comp {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(5px);
  z-index: 1;
}

#img-crop {
  position: absolute;
  margin: 2px;
  cursor: move;
  /*Set the size of the crop:*/
  width: 180px;
  height: 180px;
  z-index: 2;
}
</style>