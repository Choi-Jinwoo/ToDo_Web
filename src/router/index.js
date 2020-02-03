import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from '../components/Main';
import Login from '../components/Login';
import Register from '../components/Register';
import CtrlMenu from '../components/CtrlMenu';

import 'v-slim-dialog/dist/v-slim-dialog.css'
import SlimDialog from 'v-slim-dialog'

Vue.use(SlimDialog)
Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '',
      component: Main,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/menu',
      component: CtrlMenu,
    },
    {
      path: '*',
      component: Main,
    }
  ]
});