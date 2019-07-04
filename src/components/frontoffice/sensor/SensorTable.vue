<template>
  <div v-if="to_print">
    <div v-for="page in n_pages" :key="'page' + page" :id="'printBoard' + page" class="printBoard">
      <br>
      <v-layout row wrap v-if="has_equal_date">
        <v-data-table
          :headers="table_headers"
          :items="table_data.slice((page-1)*20, 20 * page)"
          hide-actions
          sort-icon="fas fa-angle-down"
          class="table-board"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.datetime }}</td>
            <td
              class="text-xs-left"
              :class="props.item.ok1 ? 'red lighten-3' : 'green lighten-3'"
            >{{ props.item.value1 }}</td>
            <td
              class="text-xs-left"
              :class="props.item.ok2 ? 'red lighten-3' : 'green lighten-3'"
            >{{ props.item.value2 }}</td>
            <td
              v-if="props.item.value3"
              class="text-xs-left"
              :class="props.item.ok3 ? 'red lighten-3' : 'green lighten-3'"
            >{{ props.item.value3 }}</td>
          </template>
          <template slot="no-data">No more data to display</template>
        </v-data-table>
      </v-layout>

      <v-layout v-else>
        <v-data-table
          :headers="table_headers"
          :items="table_data.slice((page-1)*20, 20 * page)"
          hide-actions
          sort-icon="fas fa-angle-down"
          class="table-board"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.datetime1 }}</td>
            <td
              class="text-xs-left"
              :class="props.item.value1 !=='' ? props.item.ok1 ? 'red lighten-3' : 'green lighten-3' : ''"
            >{{ props.item.value1 }}</td>
            <td class="text-xs-left">{{ props.item.datetime2 }}</td>
            <td
              class="text-xs-left"
              :class="props.item.value2 !=='' ? props.item.ok2 ? 'red lighten-3' : 'green lighten-3' : ''"
            >{{ props.item.value2 }}</td>
            <td class="text-xs-left">{{ props.item.datetime3 }}</td>
            <td
              v-if="props.item.value3"
              class="text-xs-left"
              :class="props.item.value3 !=='' ? props.item.ok3 ? 'red lighten-3' : 'green lighten-3' : ''"
            >{{ props.item.value3 }}</td>
          </template>
          <template slot="no-data">No more data to display</template>
        </v-data-table>
      </v-layout>
      <br>
      <v-divider></v-divider>
    </div>
  </div>
  <div v-else>
    <br>
    <v-layout row wrap v-if="has_equal_date">
      <v-data-table
        :headers="table_headers"
        :items="table_data"
        hide-actions
        sort-icon="fas fa-angle-down"
        class="table-board"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.datetime }}</td>
          <td
            class="text-xs-left"
            :class="props.item.ok1 ? 'red lighten-3' : 'green lighten-3'"
          >{{ props.item.value1 }}</td>
          <td
            class="text-xs-left"
            :class="props.item.ok2 ? 'red lighten-3' : 'green lighten-3'"
          >{{ props.item.value2 }}</td>
          <td
            v-if="props.item.value3"
            class="text-xs-left"
            :class="props.item.ok3 ? 'red lighten-3' : 'green lighten-3'"
          >{{ props.item.value3 }}</td>
        </template>
        <template slot="no-data">No more data to display</template>
      </v-data-table>
    </v-layout>

    <v-layout v-else>
      <v-data-table
        :headers="table_headers"
        :items="table_data"
        hide-actions
        sort-icon="fas fa-angle-down"
        class="table-board"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.datetime1 }}</td>
          <td
            class="text-xs-left"
            :class="props.item.value1 !=='' ? props.item.ok1 ? 'red lighten-3' : 'green lighten-3' : ''"
          >{{ props.item.value1 }}</td>
          <td class="text-xs-left">{{ props.item.datetime2 }}</td>
          <td
            class="text-xs-left"
            :class="props.item.value2 !=='' ? props.item.ok2 ? 'red lighten-3' : 'green lighten-3' : ''"
          >{{ props.item.value2 }}</td>
          <td class="text-xs-left">{{ props.item.datetime3 }}</td>
          <td
            v-if="props.item.value3"
            class="text-xs-left"
            :class="props.item.value3 !=='' ? props.item.ok3 ? 'red lighten-3' : 'green lighten-3' : ''"
          >{{ props.item.value3 }}</td>
        </template>
        <template slot="no-data">No more data to display</template>
      </v-data-table>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    records: Array,
    to_print: Boolean
  },
  data() {
    return {
      dialog_print_preview: false,
      table_headers: [],
      has_equal_date: false,
      table_data: [],
      n_pages: 1,
      colors: [
        "light-blue darken-2 white--text",
        "indigo white--text",
        "purple white--text"
      ],
      monthNames: [
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
      ]
    };
  },
  mounted() {
    if (this.records.length > 0) {
      this.has_equal_date =
        this.records.length === 2 &&
        this.formatDate(this.records[0].values[0].datetime) ===
          this.formatDate(this.records[1].values[0].datetime) &&
        (this.records.length !== 3 ||
          (this.records.length === 3 &&
            this.formatDate(this.records[0].values[0].datetime) ===
              this.formatDate(this.records[1].values[0].datetime) &&
            this.formatDate(this.records[1].values[0].datetime) ===
              this.formatDate(this.records[2].values[0].datetime)));

      if (this.has_equal_date) {
        this.formatToEqualDates();
      } else {
        this.formatToDiferentDates();
      }
      if (this.to_print) this.$emit("pages", this.n_pages);
    }
  },
  watch: {
    records(x) {
      if (x.length > 0) {
        this.table_data = [];
        this.table_headers = [];
        this.has_equal_date =
          x.length === 2 &&
          this.formatDate(x[0].values[0].datetime) ===
            this.formatDate(x[1].values[0].datetime) &&
          (x.length !== 3 ||
            (x.length === 3 &&
              this.formatDate(x[0].values[0].datetime) ===
                this.formatDate(x[1].values[0].datetime) &&
              this.formatDate(x[1].values[0].datetime) ===
                this.formatDate(x[2].values[0].datetime)));
        if (this.has_equal_date) {
          this.formatToEqualDates();
        } else {
          this.formatToDiferentDates();
        }
        if (this.to_print) this.$emit("pages", this.n_pages);
      }
    }
  },
  methods: {
    formatToEqualDates() {
      let n_values = this.records[0].values.length,
        i = 0;
      this.n_pages = Math.ceil(n_values / 20);
      this.table_headers.push({
        text: this.$t("dashboard.date"),
        sortable: false,
        align: "left"
      });
      this.records.map((record, i) => {
        this.table_headers.push({
          text: record.sensor.Sensormodel.measure,
          sortable: false,
          align: "left",
          class: this.colors[i]
        });
      });
      for (i = 0; i < n_values; i++) {
        this.table_data.push({
          datetime: this.formatDate(this.records[0].values[i].datetime),
          value1: this.records[0].values[i].value,
          ok1:
            this.records[0].values[i].value > this.records[0].profile.max ||
            this.records[0].values[i].value < this.records[0].profile.min,
          value2: this.records[1].values[i].value,
          ok2:
            this.records[1].values[i].value > this.records[1].profile.max ||
            this.records[1].values[i].value < this.records[1].profile.min,
          value3: this.records[2] ? this.records[2].values[i].value : null,
          ok3: this.records[2]
            ? this.records[2].values[i].value > this.records[2].profile.max ||
              this.records[2].values[i].value < this.records[2].profile.min
            : false
        });
      }
    },
    formatToDiferentDates() {
      let n_values = this.records[0].values.length,
        i = 0;
      this.records.forEach((record, i) => {
        let pages = Math.ceil(record.values.length / 20);
        if (pages > this.n_pages) {
          this.n_pages = pages;
          n_values = record.values.length;
        }
        this.table_headers.push({
          text: this.$t("dashboard.date"),
          sortable: false,
          align: "left"
        });
        this.table_headers.push({
          text: record.sensor.Sensormodel.measure,
          sortable: false,
          align: "left",
          class: this.colors[i]
        });
      });
      for (i = 0; i < n_values; i++) {
        this.table_data.push({
          datetime1:
            this.records[0].values[i] !== undefined
              ? this.formatDate(this.records[0].values[i].datetime)
              : "",
          value1:
            this.records[0].values[i] !== undefined
              ? this.records[0].values[i].value
              : "",
          ok1:
            this.records[0].values[i] !== undefined
              ? this.records[0].values[i].value > this.records[0].profile.max ||
                this.records[0].values[i].value < this.records[0].profile.min
              : false,
          datetime2:
            this.records[1] !== undefined &&
            this.records[1].values[i] !== undefined
              ? this.formatDate(this.records[1].values[i].datetime)
              : "",
          value2:
            this.records[1] !== undefined &&
            this.records[1].values[i] !== undefined
              ? this.records[1].values[i].value
              : "",
          ok2:
            this.records[1] !== undefined &&
            this.records[1].values[i] !== undefined
              ? this.records[1].values[i].value > this.records[1].profile.max ||
                this.records[1].values[i].value < this.records[1].profile.min
              : false,
          datetime3:
            this.records[2] !== undefined &&
            this.records[2].values[i] !== undefined
              ? this.formatDate(this.records[2].values[i].datetime)
              : "",
          value3:
            this.records[2] !== undefined &&
            this.records[2].values[i] !== undefined
              ? this.records[2].values[i].value
              : "",
          ok3:
            this.records[2] !== undefined &&
            this.records[2].values[i] !== undefined
              ? this.records[2].values[i].value > this.records[2].profile.max ||
                this.records[2].values[i].value < this.records[2].profile.min
              : false
        });
      }
    },
    formatDate(date) {
      let d = new Date(date);
      return (
        d.getHours() +
        ":" +
        d.getMinutes() +
        " - " +
        d.getDate() +
        " " +
        this.monthNames[d.getMonth()] +
        "'" +
        d
          .getFullYear()
          .toString()
          .substring(2)
      );
    }
  }
};
</script>

<style>
.printBoard {
  min-height: 750px;
  padding: 40px !important;
}

.table-board {
  width: 100%;
}
.table-board tbody td,
.table-board thead td,
.table-board thead th:not(:first-child) {
  height: 30px !important;
  padding: 0 10px !important;
}
</style>
