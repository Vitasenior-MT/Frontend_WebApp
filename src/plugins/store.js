import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';

Vue.use(Vuex)

const state = {
  vitaboxes: [],
  vitabox: [],
  board: [],
  sensor: [],
  vitaboxBoard: [],
  patient: [],
  patientBoards: [],
  patientBoard: [],
  patientSensors: [],
  patientSensor: [],
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
  setVitaboxesData(state, vitaboxesData) {
    state.vitaboxes = vitaboxesData;
  },
  setVitaboxData(state, vitaboxData) {
    state.vitabox = vitaboxData;
  },
  setBoardData(state, boardData) {
    state.board = boardData;
  },
  setSensorData(state, sensorData) {
    state.sensor = sensorData;
  },
  setVitaboxBoardData(state, vitaboxBoardData) {
    state.vitaboxBoard = vitaboxBoardData;
  },
  setPatientData(state, patientData) {
    state.patient = patientData;
  },
  setPatientBoardsData(state, patientBoardsData) {
    state.patientBoards = patientBoardsData;
  },
  setPatientBoardData(state, patientBoardData) {
    state.patientBoard = patientBoardData;
  },
  setPatientSensorsData(state, patientSensorsData) {
    state.patientSensors = patientSensorsData;
  },
  setPatientSensorData(state, patientSensorData) {
    state.patientSensor = patientSensorData;
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
  setVitaboxesData: ({
    commit
  }) => commit('setVitaboxesData'),
  setVitaboxData: ({
    commit
  }) => commit('setVitaboxData'),
  setBoardData: ({
    commit
  }) => commit('setBoardData'),
  setSensorData: ({
    commit
  }) => commit('setSensorData'),
  setVitaboxBoardData: ({
    commit
  }) => commit('setVitaboxBoardData'),
  setPatientData: ({
    commit
  }) => commit('setPatientData'),
  setPatientBoardsData: ({
    commit
  }) => commit('setPatientBoardsData'),
  setPatientBoardData: ({
    commit
  }) => commit('setPatientBoardData'),
  setPatientSensosrData: ({
    commit
  }) => commit('setPatientSensorsData'),
  setPatientSensorData: ({
    commit
  }) => commit('setPatientSensorData'),
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
