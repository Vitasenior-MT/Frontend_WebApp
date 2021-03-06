import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const state = {
  vitaboxes: [],
  vitabox: null,
  board: null,
  sensor: null,
  patients: [],
  patient: null,
  user: {
    id: null,
    token: null,
    name: null,
    email: null,
    photo: null,
    is_admin: false,
    is_doctor: false,
    warnings: 0,
    errors: 0,
    as_doctor: false,
    as_admin: false
  },
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
  setPatientsList(state, patientsData) {
    state.patients = patientsData;
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
    state.user.id = userData.id;
    state.user.token = userData.token;
    state.user.name = userData.name;
    state.user.email = userData.email;
    state.user.photo = userData.photo;
    state.user.is_admin = userData.is_admin;
    state.user.is_doctor = userData.is_doctor;
    state.user.warnings = userData.warnings;
    state.user.errors = userData.errors;
    state.user.as_admin = userData.is_admin;
    state.user.as_doctor = userData.is_doctor;
  },
  cleanData(state) {
    state.vitaboxes = [];
    state.vitabox = null;
    state.board = null;
    state.sensor = null;
    state.patients = [];
    state.patient = null;
    state.user = {
      id: null,
      token: null,
      name: null,
      email: null,
      photo: null,
      is_admin: false,
      is_doctor: false,
      warnings: 0,
      errors: 0,
      as_doctor: false,
      as_admin: false
    }
  },
  setProfileData(state, profileData) {
    profileData.forEach(y =>
      state.patient.Profiles.forEach(x => {
        if (x.id === y.id) {
          x.min = y.min;
          x.max = y.max;
        }
      }));
  },
  setPatientBoardData(state, boardData) {
    state.patient.Boards.forEach(x => {
      if (x.id === boardData.id) x = boardData;
    });
  },
  removeBoardPatient(state, board) {
    state.patient.Boards.splice(state.patient.Boards.indexOf(board), 1)
  },
  removeDoctorPatient(state, doctor) {
    state.patient.Doctor.splice(state.patient.Doctors.indexOf(doctor), 1)
  },
  switchUserRole(state) {
    state.user.as_doctor = state.user.is_doctor ? !state.user.as_doctor : false;
    state.user.as_admin = state.user.is_admin ? !state.user.as_admin : false;
  },
  setUserWarningsErrors(state, value) {
    state.user.warnings = value;
    state.user.errors = value;
  },
  editVitabox(state, vitabox) {
    state.vitabox = vitabox;
    state.vitaboxes.forEach(x => {
      if (x.id === vitabox.id) x = vitabox;
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
  setPatientsList: ({
    commit
  }) => commit('setPatientsList'),
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
  }) => commit('setProfileData'),
  removeBoardPatientData: ({
    commit
  }) => commit('removeBoardPatient'),
  removeDoctorPatient: ({
    commit
  }) => commit('removeDoctorPatient'),
  switchUserRole: ({
    commit
  }) => commit('switchUserRole'),
  resetUserWarningsErrors: ({
    commit
  }) => commit('resetUserWarningsErrors'),
  editVitabox: ({
    commit
  }) => commit('editVitabox')
}


export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()]
})
