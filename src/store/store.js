import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';

Vue.use(Vuex)

const state = {
  vitaboxes: [],
  vitabox: [],
  vitaboxBoard: [],
  patient: [],
  patientBoard: [],
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
  setVitaboxBoardData(state, vitaboxBoardData) {
    state.vitaboxBoard = vitaboxBoardData;
  },
  setPatientData(state, patientData) {
    state.patient = patientData;
  },
  setPatientBoardData(state, patientBoardData) {
    state.patientBoard = patientBoardData;
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
  setVitaboxBoardData: ({
    commit
  }) => commit('setVitaboxBoardData'),
  setPatientData: ({
    commit
  }) => commit('setPatientData'),
  setPatientBoardData: ({
    commit
  }) => commit('setPatientBoardData'),
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
