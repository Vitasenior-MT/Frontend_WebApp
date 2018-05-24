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
    name: null,
    email: null
  },
  photo: null
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
  setUserData(state, name, email) {
    state.user.name = name;
    state.user.email = email;
  },
  setPhotoData(state, photoData) {
    state.photo = photoData;
  },
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
