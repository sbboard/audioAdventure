<template>
  <div id="indexWrap">
    <h1>Audio Adventure</h1>
    <h2>Instructions</h2>
    <p>

      controls:<br>
        f - left option<br>
        j - right option<br>
        g/h - action<br>
        space - pause/play<br>
        d/k - replay

    </p>
      <div v-for="(item, index) in localPlaylist" :key="item.name" class="albumBox">
      <img :src='item.img'/><br>
      {{item.name}}<br>
      <router-link :to="'/'+index+'/1'">Start At Tape 1</router-link><br>
      Select Specific Tape: 
      <select @change="specificTape($event.target.value)">
      <option v-for="(item, indexTwo) in localPlaylist[index].tracks" :key="item.name" :value="`/${index}/${indexTwo}`">{{indexTwo}}</option>
      </select>
      </div>
      <footer>&copy; <a href="http://www.theinvisiblesundial.com/">invisible sundial</a> x <a href="https://gang-fight.com/">gang fight</a></footer>
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
@font-face
  font-family: invisibleFont
  src: url("/fonts/New_Cicle_Fina.ttf")

footer
  position: absolute
  bottom: 1em
  opacity: .4
  a
    text-transform: uppercase
    text-decoration: none
    color: white
html
  background-color: #1f1f1f
  color: white
  font-family: invisibleFont
  #indexWrap
    max-width: 1000px
    display: block
    margin: 0 auto
    h1
      font-size: 2em
    h2
      font-size: 1.5em
      margin-top: 1em
    .albumBox
      display: inline-block
      margin: 25px
      img
        width: 200px
      a
        color: white
        &::visited
          color: white
</style>
