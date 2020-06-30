import Vue from "vue"
import Router from "vue-router"
import Home from "./components/index.vue"
import Audio from "./components/audio.vue"

Vue.use(Router);

export default new Router({
  //base: '/projects/chooseAudio/',
  mode: 'history',
  routes: [{
        path: "/",
        component: Home
      },
      {
        path: "/audio/:id",
        component: Audio
      },
  ]
});