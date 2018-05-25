import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store.js'

import Home from '@/components/Home'
import NotFoundView from '@/components/404.vue'

import Dashboard from '@/components/Vitabox/Dashboard'
import VitaboxHome from '@/components/Vitabox/VitaboxHome'
import VitaboxDetail from '@/components/Vitabox/VitaboxDetail'
import VitaboxCreate from '@/components/Vitabox/VitaboxCreate'
import VitaboxEdit from '@/components/Vitabox/VitaboxEdit'
import VitaboxDelete from '@/components/Vitabox/VitaboxDelete'

import BoardHome from '@/components/Board/BoardHome'
import BoardDetail from '@/components/Board/BoardDetail'
import BoardCreate from '@/components/Board/BoardCreate'
import BoardEdit from '@/components/Board/BoardEdit'
import BoardDelete from '@/components/Board/BoardDelete'

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

function requireAuth(to, from, next) {
  var logged = store.state.user.token ? true : false;
  if (logged == true) {
    next();
  } else {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    window.console.log('Not authenticated')
    next({
      path: '/signin',
      query: {
        redirect: to.fullPath
      }
    })
  }
}


export default new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/vitabox/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: requireAuth,
    },
    {
      path: '/vitabox',
      name: 'VitaboxHome',
      component: VitaboxHome,
      beforeEnter: requireAuth,
    },
    {
      path: '/vitabox/detail',
      name: 'VitaboxDetail',
      component: VitaboxDetail,
      beforeEnter: requireAuth,
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
      path: '/board',
      name: 'BoardHome',
      component: BoardHome,
      beforeEnter: requireAuth
    },
    {
      path: '/board/detail',
      name: 'BoardDetail',
      component: BoardDetail,
      beforeEnter: requireAuth
    },
    {
      path: '/board/create',
      name: 'BoardCreate',
      component: BoardCreate,
      beforeEnter: requireAuth
    },
    {
      path: '/board/edit',
      name: 'BoardEdit',
      component: BoardEdit,
      beforeEnter: requireAuth
    },
    {
      path: '/board/delete',
      name: 'BoardDelete',
      component: BoardDelete,
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
    },
    {
      // not found handler
      path: '*',
      component: NotFoundView
    }
  ],
  mode: 'history'
})
