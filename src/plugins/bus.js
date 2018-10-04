import Vue from 'vue';
import axios from "axios";
import store from '@/plugins/store.js'

export const event_bus = new Vue({
  data: {
    http: null,
    token: store.state.user.token,

    url: process.env.NODE_ENV === "production" ? "https://vitasenior.eu-gb.mybluemix.net" : "http://192.168.161.53:8080"
    // url: "https://vitasenior-test.eu-gb.mybluemix.net"
    // url: "http://192.168.161.53:8080"
  },
  created() {
    this.http = axios.create({
      baseURL: this.url,
      headers: this.token ? {
        "Authorization": this.token,
        "Content-Type": "application/json",
        "Accept-Version": "1.0.0",
        "Accept-Language": "pt"
      } : {
          "Content-Type": "application/json",
          "Accept-Version": "1.0.0",
          "Accept-Language": "pt"
        }
    });
  },
  watch: {
    token(val) {
      this.http = axios.create({
        baseURL: this.url,
        headers: val !== null ? {
          "Authorization": val,
          "Content-Type": "application/json",
          "Accept-Version": "1.0.0",
          "Accept-Language": "pt"
        } : {
            "Content-Type": "application/json",
            "Accept-Version": "1.0.0",
            "Accept-Language": "pt"
          }
      });
    }
  }
});