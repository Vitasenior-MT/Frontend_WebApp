import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import VitaboxHome from '@/components/Vitabox/VitaboxHome'
import VitaboxDetail from '@/components/Vitabox/VitaboxDetail'
import VitaboxCreate from '@/components/Vitabox/VitaboxCreate'
import VitaboxEdit from '@/components/Vitabox/VitaboxEdit'
import VitaboxDelete from '@/components/Vitabox/VitaboxDelete'

import SensorHome from '@/components/Sensor/SensorHome'
import SensorDetail from '@/components/Sensor/SensorDetail'
import SensorCreate from '@/components/Sensor/SensorCreate'
import SensorEdit from '@/components/Sensor/SensorEdit'
import SensorDelete from '@/components/Sensor/SensorDelete'

import UserHome from '@/components/User/UserHome'
import UserDetail from '@/components/User/UserDetail'
import UserCreate from '@/components/User/UserCreate'
import UserEdit from '@/components/User/UserEdit'
import UserDelete from '@/components/User/UserDelete'
import Logout from '@/components/User/Logout'
import Signin from '@/components/User/Signin'
import Signup from '@/components/User/Signup'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/vitabox',
      name: 'VitaboxHome',
      component: VitaboxHome
    },
    {
      path: '/vitabox/detail',
      name: 'VitaboxDetail',
      component: VitaboxDetail
    },
    {
      path: '/vitabox/create',
      name: 'VitaboxCreate',
      component: VitaboxCreate
    },
    {
      path: '/vitabox/edit',
      name: 'VitaboxEdit',
      component: VitaboxEdit
    },
    {
      path: '/vitabox/delete',
      name: 'VitaboxDelete',
      component: VitaboxDelete
    },
    {
      path: '/sensor',
      name: 'SensorHome',
      component: SensorHome
    },
    {
      path: '/sensor/detail',
      name: 'SensorDetail',
      component: SensorDetail
    },
    {
      path: '/sensor/create',
      name: 'SensorCreate',
      component: SensorCreate
    },
    {
      path: '/sensor/edit',
      name: 'SensorEdit',
      component: SensorEdit
    },
    {
      path: '/sensor/delete',
      name: 'SensorDelete',
      component: SensorDelete
    },
    {
      path: '/user',
      name: 'UserHome',
      component: UserHome
    },
    {
      path: '/user/detail',
      name: 'UserDetail',
      component: UserDetail
    },
    {
      path: '/user/create',
      name: 'UserCreate',
      component: UserCreate
    },
    {
      path: '/user/edit',
      name: 'UserEdit',
      component: UserEdit
    },
    {
      path: '/user/delete',
      name: 'UserDelete',
      component: UserDelete
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ],
  mode: 'history'
})
