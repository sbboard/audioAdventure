<template>
  <div id="indexWrap">
    <h1>Last Tapes of Fate</h1>
    <div id="boxBox">
    <div id="cautionBox">
      <h2 class="normText"><i class="fas fa-exclamation-triangle"></i> CAUTION</h2>
      <p class="normText"><b>You are about to enter the world of the auditory.</b><br>
      The only tool you will have to navigate this new landscape is your sense of sound. Your only companion, a cassette player. 
  You will be able to explore this world via the unique and curious TAPES OF FATE. 
  Listening to one of these tapes will transport your consciousness to an actual parallel dimension.<br>
  If you agree to proceed after hearing this warning, close your eyes to avoid dimensional interference, open your ears, and stay safe.
      </p>
    </div>

<div id="instructions" class="normText">
  <h2>Keyboard Controls</h2>
<div>
<span><b>Select Left Tape:</b> F</span>
<span><b>Select Right Tape:</b> J</span>
<i>Note: You can identity the F and J keys with your eyes closed by their notches on most keyboards.</i><br><br>
<span><b>Action:</b> G, H <i>(keys in between F and J)</i></span>
<span><b>Restart Tape:</b> D, K <i>(keys outside of F and J)</i></span>
<span><b>Eject:</b> Escape</span>
</div>
  </div>
  </div>

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
  @media (max-width: #{650px})
      @content


@mixin tablet
  @media (min-width: 651px) and (max-width: 1232px)
      @content

@font-face
  font-family: invisibleFont
  src: url("/fonts/New_Cicle_Fina.ttf")

#boxBox
  justify-content: space-between
  display: flex
  @include mobile
    display: block

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
  @include tablet
    background-color: red
  @include mobile
    background-color: green
  #indexWrap
    max-width: 1200px
    display: block
    margin: 0 auto
    padding: 1em
    .normText
      font-family: Arial, Helvetica, sans-serif
    h1
      font-size: 2em
      text-align: center
    h2
      font-size: 1.5em
      margin-top: 1em
    #cautionBox
      background-color: white
      border: 2px solid black
      color: black
      margin-top: 1em
      padding: .5em
      border-radius: .5em
      font-size: .75em
      display: inline-block
      width: calc(50% - 2em)
      @include mobile
        width: -webkit-fill-available
        display: inline-block
      b
        font-weight: 600
      h2
        background-color: #FFE001
        border: 2px solid black
        text-align: center
        padding: .25em
        margin: 0
        margin-bottom: .5em
        font-weight: 800
        border-radius: .25em
    #instructions
      @extend #cautionBox
      h2
        background-color: #ccc
      span
        display: block
      i
        font-style: italic
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
