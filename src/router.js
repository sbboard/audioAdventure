import Vue from "vue"
import Router from "vue-router"
import Home from "./components/index.vue"
import Audio from "./components/audio.vue"

Vue.use(Router);

export default new Router({
  //base: '/projects/chooseAudio/',
  mode: 'history',
  routes: [
      {
        path: "/tape/:id",
        component: Audio
      },
      {
        path: "/tape/",
        component: Audio,
        redirect: { path: '/tape/1' }
      },
      {
        path: "*",
        component: Home
      },
  ]
});