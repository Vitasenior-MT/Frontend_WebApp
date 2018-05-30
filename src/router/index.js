import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store.js'

import Home from '@/components/Home'
import NotFoundView from '@/components/404.vue'

import ChangePass from '@/components/auth/ChgPwd'
import Signin from '@/components/auth/Index'
import Signup from '@/components/auth/Signup'

// Frontend
import Dashboard from '@/components/frontoffice/vitabox/Dashboard'
import VitaboxHome from '@/components/frontoffice/vitabox/VitaboxHome'
import VitaboxDetail from '@/components/frontoffice/vitabox/VitaboxDetail'
import VitaboxCreate from '@/components/frontoffice/vitabox/VitaboxCreate'
import VitaboxEdit from '@/components/frontoffice/vitabox/VitaboxEdit'
import VitaboxDelete from '@/components/frontoffice/vitabox/VitaboxDelete'

import BoardHome from '@/components/frontoffice/board/BoardHome'
import BoardDetail from '@/components/frontoffice/board/BoardDetail'
import BoardCreate from '@/components/frontoffice/board/BoardCreate'
import BoardEdit from '@/components/frontoffice/board/BoardEdit'
import BoardDelete from '@/components/frontoffice/board/BoardDelete'

import UserHome from '@/components/frontoffice/user/UserHome'
import UserDetail from '@/components/frontoffice/user/UserDetail'
import UserEdit from '@/components/frontoffice/user/UserEdit'
import UpdatePhoto from '@/components/frontoffice/user/UpdatePhoto'

// Backend
import VitaboxList from '@/components/backoffice/vitabox/VitaboxList'
import VitaboxRegister from '@/components/backoffice/vitabox/VitaboxRegister'
import Boardmodel from '@/components/backoffice/boardmodel/BoardmodelList'
import Sensormodel from '@/components/backoffice/sensormodel/SensormodelList'
import Utils from '@/components/backoffice/utils/utils'
import ChgPwd from '@/components/auth/ChgPwd'
import BoardDashboard from '@/components/backoffice/board/BoardDetails'
import PatientDashboard from '@/components/backoffice/patient/PatientDetails'

Vue.use(Router)

// function requireAuth(to, from, next) {
//   var logged = store.state.user.token ? true : false;
//   if (logged == true) {
//     next();
//   } else {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     window.console.log('Not authenticated')
//     next({
//       path: '/signin',
//       query: {
//         redirect: to.fullPath
//       }
//     })
//   }
// }


export default new Router({
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/vitabox/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      // beforeEnter: requireAuth
    },
    {
      path: '/vitabox',
      name: 'VitaboxHome',
      component: VitaboxHome,
      // beforeEnter: requireAuth
    },
    {
      path: '/vitabox/detail',
      name: 'VitaboxDetail',
      component: VitaboxDetail,
      // beforeEnter: requireAuth
    },
    {
      path: '/vitabox/create',
      name: 'VitaboxCreate',
      component: VitaboxCreate,
      // beforeEnter: requireAuth
    },
    {
      path: '/vitabox/edit',
      name: 'VitaboxEdit',
      component: VitaboxEdit,
      // beforeEnter: requireAuth
    },
    {
      path: '/vitabox/delete',
      name: 'VitaboxDelete',
      component: VitaboxDelete,
      // beforeEnter: requireAuth
    },
    {
      path: '/board',
      name: 'BoardHome',
      component: BoardHome,
      // beforeEnter: requireAuth
    },
    {
      path: '/board/detail',
      name: 'BoardDetail',
      component: BoardDetail,
      // beforeEnter: requireAuth
    },
    {
      path: '/board/create',
      name: 'BoardCreate',
      component: BoardCreate,
      // beforeEnter: requireAuth
    },
    {
      path: '/board/edit',
      name: 'BoardEdit',
      component: BoardEdit,
      // beforeEnter: requireAuth
    },
    {
      path: '/board/delete',
      name: 'BoardDelete',
      component: BoardDelete,
      // beforeEnter: requireAuth
    },
    {
      path: '/user',
      name: 'UserHome',
      component: UserHome,
      // beforeEnter: requireAuth
    },
    {
      path: '/user/detail',
      name: 'UserDetail',
      component: UserDetail,
      // beforeEnter: requireAuth
    },
    {
      path: '/user/edit',
      name: 'UserEdit',
      component: UserEdit,
      // beforeEnter: requireAuth
    },
    {
      path: '/user/changepass',
      name: 'ChangePass',
      component: ChangePass,
      // beforeEnter: requireAuth
    },
    {
      path: '/user/updatephoto',
      name: 'UpdatePhoto',
      component: UpdatePhoto,
      // beforeEnter: requireAuth
    },
    // backoffice
    {
      path: '/backoffice/vitabox/list',
      name: 'VitaboxList',
      component: VitaboxList
    },
    {
      path: '/backoffice/vitabox/register',
      name: 'VitaboxRegister',
      component: VitaboxRegister
    },
    {
      path: '/backoffice/boardmodel',
      name: 'Boardmodel',
      component: Boardmodel
    },
    {
      path: '/backoffice/sensormodel',
      name: 'Sensormodel',
      component: Sensormodel
    },
    {
      path: '/backoffice/utils',
      name: 'Utils',
      component: Utils
    },
    {
      path: '/chgpwd',
      name: 'ChgPwd',
      component: ChgPwd
    },
    {
      path: '/backoffice/dashboard/board',
      name: 'BoardDashboard',
      component: BoardDashboard,
      props: true
    },
    {
      path: '/backoffice/dashboard/patient',
      name: 'PatientDashboard',
      component: PatientDashboard,
      props: true
    },
    // not found handler
    {
      path: '*',
      component: NotFoundView
    }
  ]
})
