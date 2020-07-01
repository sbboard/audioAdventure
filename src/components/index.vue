<template>
  <div>
      <div v-for="(item, index) in localPlaylist" :key="item.name">
      <img :src='item.img'/><br>
      {{item.name}}<br>
      <router-link :to="'/'+index+'/1'">Start At Tape 1</router-link><br>
      Select Specific Tape: 
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      tapeInput: null,
      localPlaylist: null
    }
  },
  computed: {
    playlist() {
      return this.$store.getters.getPlaylist
    }
  },
  watch:{
    playlist(){
      this.localPlaylist = this.playlist.albums
    },
  },
}
</script>

<style lang="sass">
</style>
