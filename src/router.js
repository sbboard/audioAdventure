import Vue from "vue"
import Router from "vue-router"
import Home from "./components/index.vue"
import Audio from "./components/audio.vue"
const Replay = () => import(/* webpackChunkName: "group-replay" */ "./components/replay.vue")

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/replay/:album/:path",
      component: Replay,
    },
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