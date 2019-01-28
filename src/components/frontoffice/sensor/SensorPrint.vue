<template>
  <div class="pt-2">
    <v-tooltip bottom>
      <v-btn slot="activator" @click="dialog_print_preview=true" color="teal" icon dark>
        <v-icon>fas fa-file-medical-alt</v-icon>
      </v-btn>
      <span>print preview</span>
    </v-tooltip>
    <v-dialog v-model="dialog_print_preview" width="680">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <span class="headline primary_d--text">Print preview</span>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <v-btn slot="activator" icon @click="exportPDF">
              <v-icon color="info">fas fa-print</v-icon>
            </v-btn>
            <span>print</span>
          </v-tooltip>
          <v-btn icon @click="()=>dialog_print_preview=false">
            <v-icon color="error">fas fa-times</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div class="elevation-1 pa-4">
            <div id="printBoard">
              <v-layout>
                <label
                  class="headline text-uppercase font-weight-bold"
                >{{sensor.Sensormodel.measure}}</label>
                <v-spacer></v-spacer>
                <label class="headline">{{this.$store.state.patient.name}}</label>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row wrap>
                <v-flex md5 v-if="range">
                  <v-data-table
                    :headers="table_headers"
                    :items="records.slice(-20)"
                    hide-actions
                    sort-icon="fas fa-sort-down"
                    class="table-board"
                  >
                    <template slot="items" slot-scope="props">
                      <td
                        class="text-xs-left"
                        :class="props.item.value > range.min && props.item.value < range.max ? 'green lighten-3' : 'red lighten-3'"
                      >{{ props.index+1 }}</td>
                      <td
                        class="text-xs-left"
                        :class="props.item.value > range.min && props.item.value < range.max ? 'green lighten-3' : 'red lighten-3'"
                      >{{ formatDate(props.item.datetime) }}</td>
                      <td
                        class="text-xs-left"
                        :class="props.item.value > range.min && props.item.value < range.max ? 'green lighten-3' : 'red lighten-3'"
                      >{{ props.item.value }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
                <v-flex md7 class="pl-3 pr-1 pt-2">
                  <div v-if="range" class="mb-2">
                    <v-chip small label style="width:100%" class="ma-0">
                      <v-avatar>
                        <v-icon small color="deep-orange darken-2">fas fa-circle</v-icon>
                      </v-avatar>
                      {{"maximum acceptable (" + Math.round(this.range.max) + ")"}}
                    </v-chip>
                    <v-chip small label style="width:100%" class="ma-0">
                      <v-avatar>
                        <v-icon small color="blue darken-3">fas fa-circle</v-icon>
                      </v-avatar>
                      {{"minimum acceptable (" + Math.round(this.range.min) + ")"}}
                    </v-chip>
                  </div>
                  <div id="graphBoard">
                    <canvas id="graphPrint" ref="graphPrint"></canvas>
                  </div>
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

export default {
  props: {
    records: Array,
    sensor: Object,
    range: Object
  },
  data() {
    return {
      dialog_print_preview: false,
      chart: null,
      table_headers: [
        { text: "", sortable: false, align: "left" },
        { text: "Date", sortable: false, align: "left" },
        { text: "Value", sortable: false, align: "left" }
      ]
    };
  },
  mounted() {
    if (this.$refs.graphPrint) this.initGraph();
  },
  watch: {
    records(val) {
      this.designGraph(val);
    }
  },
  methods: {
    initGraph() {
      this.chart = new Chart(this.$refs.graphPrint, {
        type: "line",
        options: {
          legend: { display: false },
          scales: { xAxes: [{ display: true }] },
          responsive: true,
          maintainAspectRatio: false
        }
      });
    },
    designGraph(records) {
      let length = records.length;
      this.chart.data.labels = records.map((x, i) => {
        return i + 1;
      });
      let colors = records.map(x =>
        x.value < this.range.min || x.value > this.range.max
          ? "rgba(206,33, 33,.8)"
          : "rgba(71, 183, 132,.8)"
      );

      this.chart.data.datasets = [
        {
          data: records.map(x => {
            return x.value;
          }),
          pointBackgroundColor: colors,
          pointBorderColor: colors,
          borderWidth: 3,
          fill: true
        },
        {
          data: Array.from({ length }, i => this.range.min),
          borderWidth: 2,
          fill: false,
          borderColor: "#1565C0",
          pointRadius: 0
        },
        {
          data: Array.from({ length }, i => this.range.max),
          borderWidth: 2,
          fill: false,
          borderColor: "#E64A19",
          pointRadius: 0
        }
      ];
      this.chart.update();
    },
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
          var img = canvas.toDataURL();
          var pdf = new jsPDF({ orientation: "p", unit: "mm" });

          pdf.addImage(img, "PNG", 20, 20);
          pdf.save("table.pdf");
        })
        .catch(err => console.error(err.message));
    }
  }
};
</script>

<style>
#graphBoard {
  height: 350px;
}

.table-board tbody td,
.table-board thead td,
.table-board thead th:not(:first-child) {
  height: 30px !important;
  padding: 0 10px !important;
}
</style>
