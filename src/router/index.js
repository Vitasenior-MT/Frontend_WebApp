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
import ChangePass from '@/components/User/ChangePass'
import ForgotPass from '@/components/User/ForgotPass'
import ResetPass from '@/components/User/ResetPass'
import UpdatePhoto from '@/components/User/UpdatePhoto'
import Logout from '@/components/User/Logout'
import Signin from '@/components/User/Signin'
import Signup from '@/components/User/Signup'

Vue.use(Router)

function requireAuth (to, from, next) {
  var logged = localStorage.getItem("token")? true : false;
  if(logged == true){
    next();
  } else {
    next('/');
  }
}

export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/vitabox',
      name: 'VitaboxHome',
      component: VitaboxHome,
      beforeEnter: requireAuth,
      props: true
    },
    {
      path: '/vitabox/detail',
      name: 'VitaboxDetail',
      component: VitaboxDetail,
      beforeEnter: requireAuth,
      props: true
    },
    {
      path: '/vitabox/create',
      name: 'VitaboxCreate',
      component: VitaboxCreate,
      beforeEnter: requireAuth
    },
    {
      path: '/vitabox/edit',
      name: 'VitaboxEdit',
      component: VitaboxEdit,
      beforeEnter: requireAuth
    },
    {
      path: '/vitabox/delete',
      name: 'VitaboxDelete',
      component: VitaboxDelete,
      beforeEnter: requireAuth
    },
    {
      path: '/sensor',
      name: 'SensorHome',
      component: SensorHome,
      beforeEnter: requireAuth
    },
    {
      path: '/sensor/detail',
      name: 'SensorDetail',
      component: SensorDetail,
      beforeEnter: requireAuth
    },
    {
      path: '/sensor/create',
      name: 'SensorCreate',
      component: SensorCreate,
      beforeEnter: requireAuth
    },
    {
      path: '/sensor/edit',
      name: 'SensorEdit',
      component: SensorEdit,
      beforeEnter: requireAuth
    },
    {
      path: '/sensor/delete',
      name: 'SensorDelete',
      component: SensorDelete,
      beforeEnter: requireAuth
    },
    {
      path: '/user',
      name: 'UserHome',
      component: UserHome,
      beforeEnter: requireAuth
    },
    {
      path: '/user/detail',
      name: 'UserDetail',
      component: UserDetail,
      beforeEnter: requireAuth
    },
    {
      path: '/user/create',
      name: 'UserCreate',
      component: UserCreate,
      beforeEnter: requireAuth
    },
    {
      path: '/user/edit',
      name: 'UserEdit',
      component: UserEdit,
      beforeEnter: requireAuth
    },
    {
      path: '/user/delete',
      name: 'UserDelete',
      component: UserDelete,
      beforeEnter: requireAuth
    },
    {
      path: '/user/changepass',
      name: 'ChangePass',
      component: ChangePass,
      beforeEnter: requireAuth
    },
    {
      path: '/user/forgotpass',
      name: 'ForgotPass',
      component: ForgotPass
    },
    {
      path: '/user/resetpass',
      name: 'ResetPass',
      component: ResetPass,
      beforeEnter: requireAuth
    },
    {
      path: '/user/updatephoto',
      name: 'UpdatePhoto',
      component: UpdatePhoto,
      beforeEnter: requireAuth
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
