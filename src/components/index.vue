<template>
  <div id="indexWrap">
    <h1>Last Tapes of Fate</h1>
    <h2>Introduction</h2>
    <p>
      You are about to enter the world of the auditory. After reading these instructions, close your eyes in order to fully experience LAST TAPES OF FATE. Imagine next to you a library of cassette tapes. These tapes represent the entirety of your agency. With the ending of each tape you will be presented with two options - a tape on the left and a tape on the right. For those using the tapes remotely via computer technology, press F to insert the tape on the left or press J to insert the tape on the right. There may be moments during your adventure you'll want to take action (such as pick up a key, or open a door), in which case you can interact with the universe recorded on tape's string by pressing the G or H key.
<br>
Your choice of tape may lead to success or disaster.
<br>
To begin select your adventure, close your eyes, and stay safe.
    </p>
      <div v-for="(item, index) in localPlaylist" :key="item.name" class="albumBox">
      <router-link :to="'/'+index+'/1'"><img :alt='item.name + " cover"' :src='"/audio/"+index+"/"+item.img'/></router-link>
      <br>
      {{item.name}}<br>
      <router-link :to="'/'+index+'/1'">Start At Tape 1</router-link><br>
      Select Specific Tape: 
      <select @change="specificTape($event.target.value)">
      <option v-for="(item, indexTwo) in localPlaylist[index].tracks" :key="item.name" :value="`/${index}/${indexTwo}`">{{indexTwo}}</option>
      </select>
      </div>
      <footer><i class="fas fa-copyright"></i> <a href="http://www.theinvisiblesundial.com/">invisible sundial</a> x <a href="https://gang-fight.com/">gang fight</a></footer>
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
@mixin mobile
  @media (max-width: #{700px})
      @content

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
    max-width: 700px
    display: block
    margin: 0 auto
    padding: 1em
    h1
      font-size: 2em
    h2
      font-size: 1.5em
      margin-top: 1em
    .albumBox
      display: inline-block
      margin-top: 1em
      width: 30%
      transition: width .5s
      @include mobile
        width: 45%
      img
        width: 100%
      a
        color: white
        &:visited
          color: white
div.albumBox a
  color: white
</style>
