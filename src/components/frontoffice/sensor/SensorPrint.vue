<template>
  <div class="pt-2">
    <v-tooltip bottom>
      <v-btn slot="activator" @click="dialog_print_preview=true" color="teal" icon dark>
        <v-icon>fas fa-file-medical-alt</v-icon>
      </v-btn>
      <span>{{$t('dashboard.print_preview')}}</span>
    </v-tooltip>
    <v-dialog v-model="dialog_print_preview" width="1160" lazy>
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
          <div id="printTitle">
            <label class="headline">{{$store.state.patient.name}}</label>
            <v-divider></v-divider>
            <v-card height="250" light flat>
              <sensor-graph :records="records" :id="'p1'"></sensor-graph>
            </v-card>
          </div>
          <sensor-table :records="records" :to_print="true" @pages="(n)=>pages=n"></sensor-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SensorGraph from "@/components/frontoffice/sensor/SensorGraph.vue";
import SensorTable from "@/components/frontoffice/sensor/SensorTable.vue";

export default {
  props: {
    records: Array
  },
  data() {
    return {
      dialog_print_preview: false,
      pages: 0
    };
  },
  methods: {
    exportPDF() {
      if (this.pages > 0) {
        let i = 1,
          promises = [
            html2canvas(
              document.getElementById("printTitle", { logging: false })
            )
          ];
        for (i = 1; i <= this.pages; i++) {
          promises.push(
            html2canvas(document.getElementById("printBoard" + i), {
              logging: false
            })
          );
        }
        Promise.all(promises)
          .then(canvass => {
            var pdf = new jsPDF("p", "mm");

            canvass.map((canvas, i) => {
              let img = canvas.toDataURL();
              if (i > 1) {
                pdf.addPage();
                pdf.setPage(i + 1);
                pdf.addImage(
                  img,
                  "PNG",
                  0,
                  0,
                  210,
                  (canvas.height * 210) / canvas.width
                );
              } else {
                pdf.addImage(
                  img,
                  "PNG",
                  0,
                  (i * 52500) / canvas.width,
                  210,
                  (canvas.height * 210) / canvas.width
                );
              }
            });
            pdf.save("table.pdf");
          })
          .catch(err => console.error(err.message));
      }
    }
  },
  components: {
    "sensor-graph": SensorGraph,
    "sensor-table": SensorTable
  }
};
</script>

<style>
#printTitle {
  padding: 40px !important;
}
</style>
