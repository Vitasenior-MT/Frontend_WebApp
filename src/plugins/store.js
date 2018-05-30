import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';

Vue.use(Vuex)

const state = {
  vitabox: [],
  board: [],
  sensor: [],
  user: {
    token: null,
    name: null,
    email: null,
    photo: null,
    is_admin: null
  }
}

const getters = {
  user: state => state.user
}

const mutations = {
  setVitaboxData(state, vitaboxData) {
    state.vitabox = vitaboxData;
  },
  setBoardData(state, boardData) {
    state.board = boardData;
  },
  setSensorData(state, sensorData) {
    state.sensor = sensorData;
  },
  setUserData(state, userData) {
    state.user.token = userData.token;
    state.user.name = userData.name;
    state.user.email = userData.email;
    state.user.photo = userData.photo;
    state.user.is_admin = userData.is_admin;
  }
}

const actions = {
  setVitaboxData: ({
    commit
  }) => commit('setVitaboxData'),
  setBoardData: ({
    commit
  }) => commit('setBoardData'),
  setSensorData: ({
    commit
  }) => commit('setSensorData'),
  setUserData: ({
    commit
  }) => commit('setUserData'),
  setPhotoData: ({
    commit
  }) => commit('setPhotoData')
}


export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()]
})
