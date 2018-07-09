import Vue from 'vue'
import Router from 'vue-router'
import store from '@/plugins/store.js'

import Home from '@/components/Home'
import NotFoundView from '@/components/404.vue'

import ChangePass from '@/components/auth/ChgPwd'
import Signin from '@/components/auth/Login'
import Signup from '@/components/auth/Register'
import Forgot from '@/components/auth/Forgot'

// Frontend
import Dashboard from '@/components/frontoffice/dashboard/Dashboard'

import VitaboxDetail from '@/components/frontoffice/vitabox/VitaboxDetail'
import VitaboxRegister from '@/components/frontoffice/vitabox/VitaboxRegister'

import BoardDetail from '@/components/frontoffice/board/BoardDetail'

import PatientDetail from '@/components/frontoffice/patient/PatientDetail'
import AlertList from '@/components/frontoffice/alerts/AlertList'

import UserDetail from '@/components/frontoffice/user/UserDetail'

// Backend
import BOVitaboxList from '@/components/backoffice/vitabox/VitaboxList'
import BOVitaboxRegister from '@/components/backoffice/vitabox/VitaboxRegister'
import BOUserList from '@/components/backoffice/users/UserList'
import BOBoardmodel from '@/components/backoffice/boardmodel/BoardmodelList'
import BOSensormodel from '@/components/backoffice/sensormodel/SensormodelList'
import BOProfilemodel from '@/components/backoffice/profile/ProfileList'
import BOUtils from '@/components/backoffice/utils/utils'
import BOBoardDashboard from '@/components/backoffice/board/BoardDetails'
import BOPatientDashboard from '@/components/backoffice/patient/PatientDetails'

Vue.use(Router)

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
      path: '/forgot',
      name: "Forgot",
      component: Forgot
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      // beforeEnter: requireAuth
    },
    {
      path: '/vitabox/detail',
      name: 'VitaboxDetail',
      component: VitaboxDetail,
      // beforeEnter: requireAuth
    },
    {
      path: '/vitabox/register',
      name: 'VitaboxRegister',
      component: VitaboxRegister,
      // beforeEnter: requireAuth
    },
    {
      path: '/board/detail',
      name: 'BoardDetail',
      component: BoardDetail,
      // beforeEnter: requireAuth
    },
    {
      path: '/patient/detail',
      name: 'PatientDetail',
      component: PatientDetail,
      // beforeEnter: requireAuth
    },
    {
      path: '/alerts/list',
      name: 'AlertList',
      component: AlertList,
      // beforeEnter: requireAuth
    },
    {
      path: '/user/detail',
      name: 'UserDetail',
      component: UserDetail,
      // beforeEnter: requireAuth
    },
    {
      path: '/user/changepass',
      name: 'ChangePass',
      component: ChangePass,
      // beforeEnter: requireAuth
    },

    // backoffice
    {
      path: '/backoffice/vitabox/list',
      name: 'BOVitaboxList',
      component: BOVitaboxList
    },
    {
      path: '/backoffice/vitabox/register',
      name: 'BOVitaboxRegister',
      component: BOVitaboxRegister
    },
    {
      path: '/backoffice/user',
      name: 'BOUserList',
      component: BOUserList
    },
    {
      path: '/backoffice/boardmodel',
      name: 'BOBoardmodel',
      component: BOBoardmodel
    },
    {
      path: '/backoffice/sensormodel',
      name: 'BOSensormodel',
      component: BOSensormodel
    },
    {
      path: '/backoffice/profilemodel',
      name: 'BOProfilemodel',
      component: BOProfilemodel
    },
    {
      path: '/backoffice/utils',
      name: 'BOUtils',
      component: BOUtils
    },
    {
      path: '/backoffice/dashboard/board',
      name: 'BOBoardDashboard',
      component: BOBoardDashboard,
      props: true
    },
    {
      path: '/backoffice/dashboard/patient',
      name: 'BOPatientDashboard',
      component: BOPatientDashboard,
      props: true
    },
    // not found handler
    {
      path: '*',
      component: NotFoundView
    }
  ]
})
