// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import Vuetify from 'vuetify'
import store from '@/plugins/store'
import i18n from '@/plugins/i18n'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import Navbar from "@/plugins/navbar"

Vue.use(Vuetify, {
  theme: {
    raven: '#212120',
    ash: '#5b5b5b',
    ash_l: '#cccccc',
    primary: '#F37027',
    primary_l: '#fc9c02',
    primary_d: '#d65526',
    primary_s: '#f9d3c5',
    warning: '#e6ac00'
  },
  icons: {
    checkboxOn: 'fas fa-check-square',
    checkboxOff: 'far fa-square'
  },
  loaders: {
    scss: 'style!css!sass'
  }
});
Vue.config.productionTip = false

Vue.use(Navbar);

new Vue({
  el: '#app',
  router, // inject router to all children
  store, // inject store to all children,
  i18n, // inject internationalization to all children,
  template: '<App/>',
  components: {
    App,
  }
})
