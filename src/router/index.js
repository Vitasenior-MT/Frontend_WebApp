import Vue from 'vue'
import Router from 'vue-router'
import store from '@/plugins/store.js'

import Home from '@/components/Home'
import NotFoundView from '@/components/404.vue'

import ChangePass from '@/components/auth/ChgPwd'
import Signin from '@/components/auth/Login'
import Signup from '@/components/auth/Register'
import Forgot from '@/components/auth/Forgot'

import AlertList from '@/components/frontoffice/alerts/AlertList'
import ErrorList from '@/components/backoffice/errors/ErrorList'

// Frontend
import FODashboard from '@/components/frontoffice/dashboard/Dashboard'
import FOVitaboxDetail from '@/components/frontoffice/vitabox/VitaboxDetail'
import FOVitaboxRegister from '@/components/frontoffice/vitabox/VitaboxRegister'
import FOBoardDetail from '@/components/frontoffice/board/BoardDetail'
import FOPatientDetail from '@/components/frontoffice/patient/PatientDetail'
import FOUserDetail from '@/components/frontoffice/user/UserDetail'

// Doctoroffice
import DODashboard from '@/components/doctoroffice/dashboard/Dashboard'
import DOBoardDetail from '@/components/doctoroffice/board/BoardDetail'

// Backend
import BOVitaboxList from '@/components/backoffice/vitabox/VitaboxList'
import BOVitaboxRegister from '@/components/backoffice/vitabox/VitaboxRegister'
import BOUserList from '@/components/backoffice/users/UserList'
import BOBoardmodel from '@/components/backoffice/boardmodel/BoardmodelList'
import BOSensormodel from '@/components/backoffice/sensormodel/SensormodelList'
import BOProfilemodel from '@/components/backoffice/profilemodel/ProfileList'
import BOUtils from '@/components/backoffice/utils/utils'
import BOBoardDashboard from '@/components/backoffice/board/BoardDetails'
import BOPatientDashboard from '@/components/backoffice/patient/PatientDetails'

// Doctor

Vue.use(Router)

export default new Router({
  routes: [{
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
      path: '/alert/list',
      name: 'AlertList',
      component: AlertList,
    },
    {
      path: '/error/list',
      name: 'ErrorList',
      component: ErrorList,
    },

    //Frontoffice
    {
      path: '/frontoffice/dashboard',
      name: 'FODashboard',
      component: FODashboard,
    },
    {
      path: '/frontoffice/vitabox/detail',
      name: 'FOVitaboxDetail',
      component: FOVitaboxDetail,
    },
    {
      path: '/frontoffice/vitabox/register',
      name: 'FOVitaboxRegister',
      component: FOVitaboxRegister,
    },
    {
      path: '/frontoffice/board/detail',
      name: 'FOBoardDetail',
      component: FOBoardDetail,
    },
    {
      path: '/frontoffice/patient/detail',
      name: 'FOPatientDetail',
      component: FOPatientDetail,
    },
    {
      path: '/frontoffice/user/detail',
      name: 'FOUserDetail',
      component: FOUserDetail,
    },
    {
      path: '/frontoffice/user/changepass',
      name: 'ChangePass',
      component: ChangePass,
    },

    //Doctoroffice
    {
      path: '/doctoroffice/dashboard',
      name: 'DODashboard',
      component: DODashboard,
    },
    {
      path: '/doctoroffice/board/detail',
      name: 'DOBoardDetail',
      component: DOBoardDetail,
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
