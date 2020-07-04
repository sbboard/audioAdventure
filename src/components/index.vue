<template>
  <div>
      <div v-for="(item, index) in localPlaylist" :key="item.name">
      <img :src='item.img'/><br>
      {{item.name}}<br>
      <router-link :to="'/'+index+'/1'">Start At Tape 1</router-link><br>
      Select Specific Tape: 
      <select @change="specificTape($event.target.value)">
      <option v-for="(item, indexTwo) in localPlaylist[index].tracks" :key="item.name" :value="`/${index}/${indexTwo}`">{{indexTwo}}</option>
      </select>
      </div><br>
      controls:<br>
        f - left option<br>
        j - right option<br>
        g/h - action<br>
        space - pause/play<br>
        d/k - replay
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
  mounted(){
    if(this.playlist != null){
    this.localPlaylist = this.playlist.albums
    }
  },
  methods: {
    specificTape(tape){
      this.$router.push({ path: tape})
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
