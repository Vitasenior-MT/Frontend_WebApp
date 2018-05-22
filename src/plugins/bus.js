import Vue from 'vue';
import axios from "axios";

export const event_bus = new Vue({
  data: {
    http: null,
    token: localStorage.getItem("token")
  },
  created() {
    this.http = axios.create({
      // baseURL: process.env.NODE_ENV === "production" ? "https://" + location.hostname : "http://" + location.hostname + ":8080",
      baseURL: "http://" + location.hostname + ":8080",
      headers: this.token ? {
        "Authorization": this.token,
        "Content-Type": "application/json",
        "Accept-Version": "1.0.0"
      } : {
        "Content-Type": "application/json",
        "Accept-Version": "1.0.0"
      }
    });
  },
  watch: {
    token(val) {
      this.http = axios.create({
        // baseURL: process.env.NODE_ENV === "production" ? "https://" + location.hostname : "http://" + location.hostname + ":8080",
        baseURL: "http://" + location.hostname + ":8080",
        headers: val !== null ? {
          "Authorization": val,
          "Content-Type": "application/json",
          "Accept-Version": "1.0.0"
        } : {
          "Content-Type": "application/json",
          "Accept-Version": "1.0.0"
        }
      });
    }
  }
});