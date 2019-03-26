<template>
  <div class="pt-2">
    <v-tooltip bottom>
      <v-btn slot="activator" @click="printCSV" color="indigo" icon dark>
        <v-icon>fas fa-file-csv</v-icon>
      </v-btn>
      <span>{{$t('dashboard.print_csv')}}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    records: Array
  },
  data() {
    return {};
  },
  methods: {
    printCSV() {
      let rows = [];
      this.records.forEach(record => {
        record.values.forEach(x => {
          rows.push([record.sensor.Sensormodel.tag, x.value, x.datetime]);
        });
      });

      var processRow = function(row) {
        var finalVal = "";
        for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? "" : row[j].toString();
          if (row[j] instanceof Date) {
            innerValue = row[j].toLocaleString();
          }
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
          if (j > 0) finalVal += ",";
          finalVal += result;
        }
        return finalVal + "\n";
      };

      var csvFile = "";
      for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
      }

      var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, "table.csv");
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", "table.csv");
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  }
};
</script>

<style>
#printTitle {
  padding: 40px !important;
}
</style>