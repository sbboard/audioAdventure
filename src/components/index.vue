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

<div id="instructions">
  <h2>Keyboard Controls</h2>
<div>
  <img src="../assets/instructions.png"
  alt="Select Left Tape: F, Select Right Tape: J, Action: G, H, Restart Tape: D, K, Eject: Escape"
  />
</div>
  </div>
  </div>
      <div v-for="(item, index) in localPlaylist" :key="item.name" class="albumBox">
        <router-link :to="'/'+index+'/1'"><img :alt='item.name + " cover"' :src='"/audio/"+item.folder+"/"+item.img'/></router-link>
        <div class="info">
        <div class="boldName">{{item.name}}</div>
        <div class="topPart">
        <router-link :to="'/'+index+'/1'" tag="button" class="startFirst">Start AT TAPE 1</router-link>
        </div>
        <div class="topPart">
        Select Specific Tape: 
        <select @change="specificTape($event.target.value)">
          <option v-for="indexTwo in localPlaylist[index].numberOfTapes" :key="indexTwo" :value="`/${index}/${indexTwo}`">{{indexTwo}}</option>
        </select>
        </div>
          <p class="blurb">{{item.blurb}}</p>
          <div class="creditSect">
            <span><b>Written by </b> 
            <template v-if="item.credits.writer[1] == null">
            {{item.credits.writer[0]}}
            </template>
            <template v-else>
            <a :href="item.credits.writer[1]">{{item.credits.writer[0]}}</a>
            </template>
            </span>
            <span><b>Album Art by </b> 
            <template v-if="item.credits.art[1] == null">
            {{item.credits.art[0]}}
            </template>
            <template v-else>
            <a :href="item.credits.art[1]">{{item.credits.art[0]}}</a>
            </template>
            </span>
            <span><b>Voice Talent by </b> 
            <div v-for="(person, indexTwo) in item.credits.va" :key='person[0]' class="actor">
            <template v-if="person[1] == null">{{person[0]}}</template><template v-else><a :href="person[1]">{{person[0]}}</a></template><span class="comma" v-if="indexTwo < item.credits.va.length - 1">, </span>
            </div>

            </span>
          </div>
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
$CYOARED: #ff2300

@mixin mobile
  @media (max-width: #{650px})
      @content


@mixin tablet
  @media (min-width: 651px) and (max-width: 1232px)
      @content

@font-face
  font-family: invisibleFont
  src: url("/fonts/benga.otf")

.startFirst
  width: 100%
  font-family: invisibleFont
  font-size: 1em
  padding: .5em 0
  margin: .5em 0
  background-color: $CYOARED
  border-radius: .5em
  color: white
  text-transform: uppercase
  border: 0
.blurb
  padding: 1em 0
  border-top: solid black 1px
  font-style: italic
  margin: .5em 0
  border-bottom: solid black 1px
.topPart
  font-size: 1.25em
#boxBox
  justify-content: space-between
  display: flex
  @include mobile
    display: block
.creditSect
  span
    display: block
    .actor
      display: inline
    .comma
      display: inline
    b
      font-weight: 700
      
footer
  position: absolute
  bottom: 0
  padding: 1em 0
  margin: 0 auto
  display: block
  left: 0
  right: 0
  text-align: center
  color: black
  background-color: #f4f3f0
  a
    text-transform: uppercase
    text-decoration: none
    color: black
.boldName
    font-weight: 800
    font-size: 2em
    color: $CYOARED
    text-transform: uppercase
html
  background-color: rgb(244,243,240)
  color: black
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
      background-color: $CYOARED
      border-radius: .5em
      padding: .25em
      color: white
      text-transform: uppercase
    h2
      font-size: 1.5em
      margin-top: 1em
    #cautionBox
      background-color: white
      color: black
      margin-top: 1em
      padding: .5em
      border-radius: .5em
      font-size: 1em
      display: inline-block
      width: calc(50% - 2em)
      @include mobile
        width: -webkit-fill-available
        display: inline-block
      b
        font-weight: 600
      h2
        background-color: #FFE001
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
        background-color: $CYOARED
        color: white
        text-transform: uppercase
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
      width: 100%
      transition: width .5s
      img
        width: 25%
        //border: 5px solid blue 
        //outline: 5px solid red
        margin: 5px
      a
        color: black
        &:visited
          color: black
      .info
        display: inline-block
        margin-left: .5em
        vertical-align: top
        margin-left: 1em
      .credits
        line-height: 1.1
        font-size: .75em
        width: calc(50% - 1em)
        display: inline-block
        position: absolute
        height: -webkit-fill-available
        padding: .5em
        background-color: #797979
        color: #1F1F1F
        b
          font-weight: 800
        span
          display: block
          .comma
            display: inline
            width: fit-content
            white-space: break-spaces
        .actor
          display: inline-block
        a
          color: #1F1F1F
div.albumBox a
  color: black
</style>
