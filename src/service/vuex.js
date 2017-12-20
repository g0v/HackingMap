import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeProjectKey: 0,
    editingProject: null,
    isEditing: false,
  },
  mutations: {
    setActiveProjectKey: (state, projectKey) => {
      // console.log('[vuex] setActiveProjectKey()', { projectKey })
      state.activeProjectKey = projectKey
    },
    setEditingProject: (state, project) => {
      state.editingProject = project
      state.isEditing = project !== null
    },
  },
})

export default store
