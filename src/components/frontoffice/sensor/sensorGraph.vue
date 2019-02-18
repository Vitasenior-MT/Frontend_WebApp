<template>
  <div :id="`graphBoard-${id}`" class="bioGraph">
    <canvas :id="`canvasBoard-${id}`"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    id: String,
    records: Array
  },
  data: () => {
    return {
      chart: null,
      colors: ["#0288D1", "#3F51B5","#9C27B0"]
    };
  },
  watch: {
    records(x) {
      if (x.length > 0) {
        this.designGraph();
      } else {
        this.clearGraph();
      }
    }
  },
  mounted() {
    this.chart = new Chart(document.getElementById("canvasBoard-" + this.id), {
      type: "line",
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  second: "MMM DD - H:mm",
                  minute: "MMM DD - H:mm",
                  hour: "MMM DD - H:mm",
                  day: "MMM DD - H:mm",
                  month: "MMM DD - H:mm"
                }
              },
              gridLines: { display: false }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { left: 5 } }
      }
    });
    if (this.records.length > 0) {
      this.designGraph();
    }
  },
  methods: {
    designGraph() {
      let datasets = [];

      this.records.forEach((record, i) => {
        let colors = record.values.map(x =>
          x.value < record.profile.min || x.value > record.profile.max
            ? "rgba(206,33, 33,.8)"
            : "rgba(71, 183, 132,.8)"
        );
        datasets.push({
          label:
            record.values.length > 0
              ? record.sensor.Sensormodel.measure
              : record.sensor.Sensormodel.measure + " (no data)",
          data: record.values.map(x => {
            let d1 = new Date(x.datetime).toISOString().split("T");
            let d2 = d1[1].split(":");
            return {
              x: d1[0] + " " + d2[0] + ":" + d2[1],
              y: x.value
            };
          }),
          pointBackgroundColor: colors,
          pointBorderColor: colors,
          borderColor: this.colors[i],
          borderWidth: 3,
          cubicInterpolationMode: "monotone"
        });
      });

      this.chart.data.datasets = datasets;
      this.chart.update();
    },
    clearGraph() {
      this.chart.data.datasets = [];
      this.chart.update();
    }
  }
};
</script>

<style>
.bioGraph {
  height: 100%;
  position: relative;
  padding: 8px 4px 4px 4px;
}
</style>
