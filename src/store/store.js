import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';

Vue.use(Vuex)

const state = {
  vitaboxes: [],
  vitabox: [],
  patient: [],
  board: [],
  sensor: [],
  user: {
    token: null,
    name: null,
    email: null,
    photo: null
  }
}

const getters = {
  user: state => state.user
}

const mutations = {
  setVitaboxesData(state, vitaboxesData) {
    state.vitaboxes = vitaboxesData;
  },
  setVitaboxData(state, vitaboxData) {
    state.vitabox = vitaboxData;
  },
  setPatientData(state, patientData) {
    state.patient = patientData;
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
  }
}

const actions = {
  setVitaboxesData: ({
    commit
  }) => commit('setVitaboxesData'),
  setVitaboxData: ({
    commit
  }) => commit('setVitaboxData'),
  setPatientData: ({
    commit
  }) => commit('setPatientData'),
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
