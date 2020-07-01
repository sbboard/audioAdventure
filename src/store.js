import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    playlist: null
  },
  getters:{
      getPlaylist: state=> {
          return state.playlist
      },
    },
  mutations: {
    setPlaylist(state, json) {
      state.playlist = json
    }
  }
})