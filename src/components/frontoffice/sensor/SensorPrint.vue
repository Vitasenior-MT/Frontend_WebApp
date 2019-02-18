<template>
  <div class="pt-2">
    <v-tooltip bottom>
      <v-btn slot="activator" @click="dialog_print_preview=true" color="teal" icon dark>
        <v-icon>fas fa-file-medical-alt</v-icon>
      </v-btn>
      <span>{{$t('dashboard.print_preview')}}</span>
    </v-tooltip>
    <v-dialog v-model="dialog_print_preview" width="1160">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <span class="headline primary_d--text">{{$t('dashboard.print_preview')}}</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <v-btn slot="activator" icon @click="exportPDF">
              <v-icon color="info">fas fa-print</v-icon>
            </v-btn>
            <span>{{$t('dashboard.print')}}</span>
          </v-tooltip>
          <v-btn icon @click="()=>dialog_print_preview=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div class="elevation-1">
            <div id="printBoard">
              <label class="headline">{{this.$store.state.patient.name}}</label>
              <v-divider></v-divider>
              <v-card height="250" light flat>
                <sensor-graph :records="records" :id="'p1'"></sensor-graph>
              </v-card>
              <br>
              <v-layout row wrap v-if="has_equal_date">
                <v-flex xs3>
                  <v-data-table
                    :headers="table_headers"
                    :items="records[0].values.slice(-20)"
                    hide-actions
                    sort-icon="fas fa-sort-down"
                    class="table-board"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ formatDate(props.item.datetime) }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
                <v-flex
                  xs3
                  v-for="(record, i) in records"
                  :key="record.sensor.id"
                  style="border-left: 1px solid #777;"
                >
                  <v-alert
                    :value="true"
                    :color="colors[i]"
                    class="my-0"
                  >{{record.sensor.Sensormodel.measure}}</v-alert>
                  <v-data-table
                    hide-headers
                    :items="record.values.slice(-20)"
                    hide-actions
                    sort-icon="fas fa-sort-down"
                    class="table-board"
                  >
                    <template slot="items" slot-scope="props">
                      <td
                        class="text-xs-left"
                        :class="props.item.value > record.profile.max || props.item.value < record.profile.min ? 'red lighten-3' : 'green lighten-3'"
                      >{{ props.item.value }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
              <v-layout v-else>
                <v-flex
                  xs4
                  v-for="(record, i) in records"
                  :key="record.sensor.id"
                  style="border-left: 1px solid #777;"
                >
                  <v-alert
                    :value="true"
                    :color="colors[i]"
                    class="my-0"
                  >{{record.sensor.Sensormodel.measure}}</v-alert>
                  <v-data-table
                    :headers="table_headers[i]"
                    :items="record.values.slice(-20)"
                    hide-actions
                    sort-icon="fas fa-sort-down"
                    class="table-board"
                  >
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-left">{{ formatDate(props.item.datetime) }}</td>
                      <td
                        class="text-xs-left"
                        :class="props.item.value > record.profile.max || props.item.value < record.profile.min ? 'red lighten-3' : 'green lighten-3'"
                      >{{ props.item.value }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SensorGraph from "@/components/frontoffice/sensor/SensorGraph.vue";

export default {
  props: {
    records: Array
  },
  data() {
    return {
      dialog_print_preview: false,
      chart: null,
      table_headers: [],
      has_equal_date: false,
      colors: ["#0288D1", "#3F51B5", "#9C27B0"]
    };
  },
  mounted() {
    if (this.records.length > 0) {
      this.has_equal_date =
        this.records.length > 1 &&
        this.formatDate(this.records[0].values[0].datetime) ===
          this.formatDate(this.records[1].values[0].datetime);
      if (this.has_equal_date) {
        this.table_headers = [
          { text: this.$t("dashboard.date"), sortable: false, align: "left" }
        ];
      } else {
        this.records.forEach(x => {
          this.table_headers.push([
            { text: this.$t("dashboard.date"), sortable: false, align: "left" },
            {
              text: this.$t("dashboard.value"),
              sortable: false,
              align: "left"
            }
          ]);
        });
      }
    }
  },
  watch: {
    records(val) {
      this.designGraph(val);
    }
  },
  methods: {
    formatDate(date) {
      let monthNames = [
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
      ];
      let d = new Date(date);
      return (
        d.getHours() +
        ":" +
        d.getMinutes() +
        " - " +
        d.getDate() +
        " " +
        monthNames[d.getMonth()] +
        "'" +
        d
          .getFullYear()
          .toString()
          .substring(2)
      );
    },
    exportPDF() {
      html2canvas(document.getElementById("printBoard"))
        .then(canvas => {
          console.log(canvas.width, canvas.height);

          var img = canvas.toDataURL();
          var pdf = new jsPDF("p", "mm");

          pdf.addImage(
            img,
            "PNG",
            0,
            0,
            210,
            (canvas.height * 210) / canvas.width
          );
          pdf.save("table.pdf");
        })
        .catch(err => console.error(err.message));
    }
  },
  components: {
    "sensor-graph": SensorGraph
  }
};
</script>

<style>
#printBoard {
  min-height: 1000px;
  padding: 40px !important;
}
.table-board tbody td,
.table-board thead td,
.table-board thead th:not(:first-child) {
  height: 30px !important;
  padding: 0 10px !important;
}
</style>
