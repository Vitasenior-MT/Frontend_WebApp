// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import Vuetify from 'vuetify'
import store from '@/plugins/store'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import Navbar from "@/plugins/navbar"
import Chart from "chart.js";

Vue.use(Vuetify, {
  theme: {
    raven: '#212120',
    ash: '#5b5b5b',
    ash_l: '#fafafa',
    primary: '#3faf7d',
    primary_l: '#8fd6b6',
    primary_d: '#2f835d',
    primary_s: '#daf1e7',
    warning: '#e6ac00'
  }
});
Vue.config.productionTip = false

Vue.use(Navbar);

new Vue({
  el: '#app',
  router, // inject router to all children
  store, // inject store to all children
  template: '<App/>',
  components: {
    App,
  }
})
