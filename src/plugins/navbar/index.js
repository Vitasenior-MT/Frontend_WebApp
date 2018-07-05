import Navbar from './Navbar.vue'

const links = {
  backoffice: [
    {
      name: 'Account',
      icon: 'fas fa-user-circle',
      path: '/user/changepass'
    },
    {
      name: 'Vitaboxes',
      icon: 'fas fa-tv',
      path: '/backoffice/vitabox/list'
    },
    {
      name: 'Users',
      icon: 'fas fa-users',
      path: '/backoffice/user'
    },
    {
      name: 'Boards Models',
      icon: 'fas fa-broadcast-tower',
      path: '/backoffice/boardmodel'
    },
    {
      name: 'Sensors Models',
      icon: 'fas fa-microchip',
      path: '/backoffice/sensormodel'
    },
    {
      name: 'Profiles Models',
      icon: 'fas fa-heartbeat',
      path: '/backoffice/profilemodel'
    },
    {
      name: 'Utils',
      icon: 'fas fa-question',
      path: '/backoffice/utils'
    }
  ],
  frontoffice: [
    {
      name: 'Change Password',
      icon: 'fas fa-key',
      path: '/user/changepass'
    }
  ]
};

const NavbarPlugin = {

  install(Vue) {
    Vue.mixin({
      data() {
        return {
          links: links
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$links', {
      get() {
        return this.$root.links
      }
    })
    Vue.component('navbar', Navbar)
  }
};

export default NavbarPlugin;
