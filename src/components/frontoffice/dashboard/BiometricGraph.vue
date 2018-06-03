<template>
    <div id="graph" style="height:350px; position:relative;">
        <canvas id="planet-chart" ></canvas>
    </div>
</template>

<script>
import planetChartData from "./chart-data.js";

export default {
  name: "biometricGraph",
  data() {
    return {
      planetChartData: planetChartData
    };
  },
  mounted() {
    this.createChart("planet-chart", this.planetChartData);
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);

      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    }
  }
};
</script>

<style>
</style>

