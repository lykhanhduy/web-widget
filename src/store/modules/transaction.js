
//initial state
const state = {
    listStudent: [],
    detailStudent: {}
}

//getter
const getters = {
    allStudents: state => state.listStudent,
    detailStudent: state => state.detailStudent
}

//action
const actions = {
    getListStudent({commit}){
        return api.get('http://localhost:3000/students')
            .then((response) => commit('getAll', response, 'success'))
            .catch((error) => commit('getAll', error, 'error'));
    },
    getDetailStudent({commit}, id){
        return api.get('http://localhost:3000/student/'+id)
            .then((response) => commit('getDetail', response, 'success'))
            .catch((error) => commit('getDetail', error, 'error'));
    },
    editStudent({commit}, data) {
        console.log(data)
        return api.post('http://localhost:3000/student/'+data._id, data)
            .then((response) => commit('editStudent', response, 'success'))
            .catch((error) => commit('editStudent', error, 'error'));
    }
}

//mutation
const mutations = {
    getAll(state, data, status) {
      if(status == 'error') {
          console.log(data);
      } else {
        state.listStudent = data;
      }
    },
    getDetail(state, data, status) {
        if(status == 'error') {
            console.log(data);
        } else {
          state.detailStudent = data;
        }
    },
    editStudent(state, data, status) {
        
    }
  }


export default {
    state,
    getters,
    actions,
    mutations
}