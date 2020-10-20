<template>
  <div id="app">
  <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
    }
  },
  methods:{
    custom_sort(b, a) {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  },
  beforeMount(){
      axios.get('/playlist.json')
      .then((response) => {
        let newRespo = {"albums":response.data.albums.sort(this.custom_sort)}
        this.$store.commit('setPlaylist', newRespo)
      })
  }
}
</script>

<style lang="sass">
</style>
