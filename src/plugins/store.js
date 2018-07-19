import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Cookies from 'js-cookie';

Vue.use(Vuex)

const state = {
  vitaboxes: [],
  vitabox: null,
  board: null,
  sensor: null,
  patient: null,
  user: {
    token: null,
    name: null,
    email: null,
    photo: null,
    is_admin: false,
    is_doctor: false,
    warnings: 0,
    errors: 0
  }
}

const mutations = {
  setVitaboxesList(state, vitaboxesData) {
    state.vitaboxes = vitaboxesData;
  },
  addVitaboxToList(state, vitaboxData) {
    state.vitaboxes.push(vitaboxData);
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
  setPatientData(state, patientData) {
    state.patient = patientData;
  },
  addBoardToPatient(state, board) {
    state.patient.Boards.push(board);
  },
  addDoctorToPatient(state, user) {
    state.patient.Doctors.push(user);
  },
  setUserData(state, userData) {
    state.user.token = userData.token;
    state.user.name = userData.name;
    state.user.email = userData.email;
    state.user.photo = userData.photo;
    state.user.is_admin = userData.is_admin;
    state.user.is_doctor = userData.is_doctor;
    state.user.warnings = userData.warnings;
    state.user.errors = userData.errors;
  },
  cleanData(state) {
    state.vitaboxes = [];
    state.vitabox = null;
    state.board = null;
    state.sensor = null;
    state.patient = null;
    state.user.token = null;
    state.user.name = null;
    state.user.email = null;
    state.user.photo = null;
    state.user.is_admin = false;
    state.user.is_doctor = false;
    state.user.warnings = 0;
    state.user.errors = 0;
    state.vitabox = null;
    state.board = null;
    state.sensor = null;
    state.patient = null;
  },
  setProfileData(state, profileData) {
    state.patient.Profiles.forEach(x => {
      if (x.id === profileData.id) x = profileData;
    });
  }
}

const actions = {
  setVitaboxesList: ({
    commit
  }) => commit('setVitaboxesList'),
  addVitaboxToList: ({
    commit
  }) => commit('addVitaboxToList'),
  setVitaboxData: ({
    commit
  }) => commit('setVitaboxData'),
  setBoardData: ({
    commit
  }) => commit('setBoardData'),
  setSensorData: ({
    commit
  }) => commit('setSensorData'),
  setPatientData: ({
    commit
  }) => commit('setPatientData'),
  addBoardToPatient: ({
    commit
  }) => commit('addBoardToPatient'),
  addDoctorToPatient: ({
    commit
  }) => commit('addDoctorToPatient'),
  setUserData: ({
    commit
  }) => commit('setUserData'),
  cleanData: ({
    commit
  }) => commit('cleanData'),
  setProfileData: ({
    commit
  }) => commit('setProfileData')
}


export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()]
})
