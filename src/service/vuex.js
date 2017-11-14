import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeProjectKey: 0,
  },
  mutations: {
    setActiveProjectKey: (state, projectKey) => {
      // console.log('[vuex] setActiveProjectKey()', { projectKey })
      state.activeProjectKey = projectKey
    },
  },
})

export default store
