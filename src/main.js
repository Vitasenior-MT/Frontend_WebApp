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

import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA0u4i3aBE3vhcVjO_s-aLFL8dVIGJwrOo',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
 
  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,
 
  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

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
