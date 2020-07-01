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
        path: "/:album/:id",
        component: Audio
      },
      {
        path: "/:album/",
        component: Audio,
        redirect: { path: '/:album/1' }
      },
      {
        path: "*",
        component: Home
      },
  ]
});