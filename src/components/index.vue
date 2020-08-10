<template>
  <div id="indexWrap">
    <h1>1000 Tapes of Fate</h1>
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
  <img src="../assets/instructions.png"
  alt="Select Left Tape: F, Select Right Tape: J, Action: G, H, Restart Tape: D, K, Eject: Escape"
  />
</div>
  </div>
  </div>
      <div v-for="(item, index) in localPlaylist" :key="item.name" class="albumBox">
        <div class="info">
        <router-link :to="'/'+index+'/1'"><img :alt='item.name + " cover"' :src='"/audio/"+index+"/"+item.img'/></router-link>
        <br>
        <div class="boldName">{{item.name}}</div>
        <router-link :to="'/'+index+'/1'">Start At Tape 1</router-link><br>
        Select Specific Tape: 
        <select @change="specificTape($event.target.value)">
          <option v-for="(item, indexTwo) in localPlaylist[index].tracks" :key="item.name" :value="`/${index}/${indexTwo}`">{{indexTwo}}</option>
        </select>
        </div>
        <div class="credits normText">
          <span><b>written by </b> 
          <template v-if="item.credits.writer[1] == null">
          {{item.credits.writer[0]}}
          </template>
          <template v-else>
          <a :href="item.credits.writer[1]">{{item.credits.writer[0]}}</a>
          </template>
          </span>
          <span><b>album art by </b> 
          <template v-if="item.credits.art[1] == null">
           {{item.credits.art[0]}}
          </template>
          <template v-else>
           <a :href="item.credits.art[1]">{{item.credits.art[0]}}</a>
          </template>
          </span>
          <span><b>voice talent by </b> 
          <div v-for="(person, indexTwo) in item.credits.va" :key='person[0]' class="actor">
          <template v-if="person[1] == null">
          {{person[0]}}
          </template><template v-else>
          <a :href="person[1]">{{person[0]}}</a>
          </template><template v-if="indexTwo < item.credits.va.length - 1">, </template>
          </div>

          </span>
        </div>
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
.boldName
    font-weight: 800
    font-size: 1.25em
    margin-bottom: .25em
html
  background-color: #1f1f1f
  color: white
  font-family: invisibleFont
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
        @include mobile
          font-size: 1em
    #instructions
      @extend #cautionBox
      h2
        background-color: #ccc
      span
        display: block
      i
        font-style: italic
      div
        text-align: center
      @include mobile
        display: none
    .albumBox
      display: inline-block
      margin-top: 1em
      position: relative
      width: calc(33.3% - 2em)
      transition: width .5s
      @include tablet
        width: calc(33.3% - 2em)
      @include mobile
        width: calc(50% - 2em)
      img
        width: 100%
      a
        color: white
        &:visited
          color: white
      .info
        width: 50%
        display: inline-block
        margin-right: .5em
      .credits
        line-height: 1.1
        font-size: .75em
        width: calc(50% - 2px - 1em)
        display: inline-block
        border: 1px solid white
        position: absolute
        height: -webkit-fill-available
        padding: .5em
        b
          font-weight: 800
        span
          display: block
        .actor
          display: inline-block
div.albumBox a
  color: white
</style>
