<template>
  <div id="indexWrap">
    <h1>Last Tapes of Fate</h1>
    <h2 class="normText">CAUTION</h2>
    <p class="normText">You are about to enter the world of the auditory. The only tool you will have to navigate this new landscape is your sense of sound. Your only companion, a cassette player.<br>
You will be able to explore this world via the unique and curious TAPES OF FATE. Listening to one of these tapes transports your consciousness to an actual parallel dimension. At the end of each tape you will be presented with two options: a tape on the left and a tape on the right. For those using a cassette player remotely via computer technology, press the F key to insert the tape on the left or press the J key to insert the tape on the right. There may be moments during your adventure you will want to take action (such as to pick up a key, or open a door), in which case you can interact with the universe recorded on the tape by pressing the G or H key.<br>
If you agree to proceed after hearing this warning, close your eyes to avoid dimensional interference, open your ears, and stay safe.
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
    .normText
      font-family: Arial, Helvetica, sans-serif
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
