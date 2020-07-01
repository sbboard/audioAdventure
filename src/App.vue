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
  beforeMount(){
      axios.get('/playlist.json')
      .then((response) => {
        this.$store.commit('setPlaylist', response.data)
      })
  }
}
</script>

<style lang="sass">
</style>
