import Navbar from './Navbar.vue'

const NavbarPlugin = {

  install(Vue) {
    Object.defineProperty(Vue.prototype, '$links', {
      get() {
        return this.$root.links
      }
    })
    Vue.component('navbar', Navbar)
  }
};

export default NavbarPlugin;
