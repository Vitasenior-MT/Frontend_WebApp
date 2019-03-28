<template>
  <v-content id="file_menu">
    <v-card>
      <v-card-title class="pl-0">
        <v-spacer></v-spacer>
        <v-text-field
          prepend-icon="fas fa-search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :search="search"
        :items="files"
        class="elevation-1"
        sort-icon="fas fa-angle-down"
        next-icon="fas fa-angle-right"
        prev-icon="fas fa-angle-left"
        :rows-per-page-items="[10]"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.filename }}</td>
          <td>{{ props.item.size }}</td>
          <td>{{ props.item.day }}</td>
          <td>{{ props.item.month }}</td>
          <td>{{ props.item.year }}</td>
          <td class="text-xs-right">
            <a
              class="mx-0 v-btn v-btn--icon theme--light"
              :href="getLink(props.item.filename)"
              :download="props.item.filename"
              target="_blank"
            >
              <div class="v-btn__content">
                <v-icon color="secondary">fas fa-file-download</v-icon>
              </div>
            </a>
            <v-btn icon class="mx-0" @click.native="selectFile(props.item.filename)">
              <v-icon color="error">fas fa-minus-circle</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog_remove_file" max-width="500px">
      <v-card v-if="selectedFile">
        <v-card-title>
          <span class="headline error--text">Remove file</span>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="dialog_remove_file=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>Are you sure you want to delete this file "{{selectedFile}}"?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="error darken-1" @click.native="removeFile">PROCEED</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { event_bus } from "@/plugins/bus.js";

export default {
  name: "sensor_menu",
  data: () => {
    return {
      search: "",
      headers: [
        { text: "File", align: "left", value: "filename" },
        { text: "Size", align: "left", value: "size" },
        { text: "Day", align: "left", sortable: false },
        { text: "Month", align: "left", sortable: false },
        { text: "Year", align: "left", sortable: false },
        { text: "Actions", align: "right", sortable: false }
      ],
      files: [],
      months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      dialog_remove_file: false,
      selectedFile: null
    };
  },
  mounted() {
    event_bus.$emit("waiting", true);
    event_bus.$data.http
      .get("/record/analytic")
      .then(response => {
        this.files = response.data.files.map(file => {
          let date = new Date(file.filename.split("_")[0]);
          return {
            filename: file.filename,
            size: file.size,
            year: date.getFullYear(),
            month: this.months[date.getMonth() + 1],
            day: date.getDate()
          };
        });
        event_bus.$emit("waiting", false);
      })
      .catch(error => {
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
  },
  methods: {
    getLink(filename) {
      return event_bus.$data.url + "/file/" + filename;
    },
    removeFile() {
      event_bus.$emit("waiting", true);
      this.dialog_remove_file = false;
      event_bus.$data.http
        .delete("/file/" + this.selectedFile)
        .then(response => {
          this.files = this.files.filter(
            file => file.filename != this.selectedFile
          );
          this.selectedFile = null;
          event_bus.$emit("waiting", false);
        })
        .catch(error => {
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
    },
    selectFile(filename) {
      this.selectedFile = filename;
      this.dialog_remove_file = true;
    }
  }
};
</script>

<style>
</style>
