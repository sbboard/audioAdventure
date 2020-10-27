<template>
<div id="bigBoy">
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
      <div v-for="(item, index) in localPlaylist" :key="item.name" class="albumBox" :style="{animationDelay: `${(.25 * index) + .25}s`}">
        <router-link :to="'/'+index+'/1'"><img :alt='item.name + " cover"' :src='"/audio/"+item.folder+"/"+item.img'/></router-link>
        <div class="info">
        <div class="boldName"><span>#{{localPlaylist.length-index}}</span> {{item.name}}</div>
        <div class="topPart">
        <router-link :to="'/'+index+'/1'" tag="button" class="startFirst">begin AT TAPE 1</router-link>
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
  <div id="texture"></div>
  <div id="burn"></div>
  <div id="cardboard"></div>
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
      this.localPlaylist = this.playlist.albums.sort(this.custom_sort)
    }
  },
  methods: {
    specificTape(tape){
      this.$router.push({ path: tape})
    },
    custom_sort(b, a) {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  },
  watch:{
    playlist(){
      this.localPlaylist = this.playlist.albums.sort(this.custom_sort)
    },
  },
}
</script>

<style lang="sass" scoped>
$CYOARED: #ff3131c7
$bgColor: #f4f3e8

@function shadowMode($color)
  $newColor: opacify($color,.5)
  $result: drop-shadow(0px 3px 2px $newColor)
  @return $result

@mixin mobile
  @media (max-width: #{400px})
      @content


@mixin tablet
  @media (max-width: 700px)
      @content

@font-face
  font-family: invisibleFont
  src: url("/fonts/benga.otf")

#burn
  z-index: -1
  position: absolute
  width: 100vw
  height: 100%
  margin: 0
  left: 0
  top: 0
  overflow: hidden
  mix-blend-mode: color-burn
  background: radial-gradient(rgba(236, 205, 174, 0), rgba(255,68,37,.3))
#cardboard
  background-image: url("../assets/paper.jpg")
  position: absolute
  width: 100vw
  height: 100%
  margin: 0
  left: 0
  top: 0
  overflow: hidden
  z-index: -2
  opacity: .25
  filter: grayscale(1) brightness(1.2)
  background-position: center
#texture
  @extend #cardboard
  z-index: 5
  pointer-events: none
  opacity: .3
  mix-blend-mode: multiply
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
  cursor: pointer
  filter: shadowMode($CYOARED)
  transition: background-color .25s
  @include tablet
    width: 50%
  @include mobile
    width: 75%
  &:hover
    background-color: darken($CYOARED, 20%)
    filter: shadowMode(darken($CYOARED, 20%))
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
  margin: 1em 0 2em 0
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
  display: block
  text-align: center
  color: black
  a
    text-transform: uppercase
    text-decoration: none
    color: black
.boldName
    font-weight: 800
    font-size: 2em
    color: black
    text-transform: uppercase
    @include tablet
      margin-top: .25em
    span 
      color: $CYOARED
#bigBoy
  background-color: $bgColor
  color: black
  font-family: invisibleFont
  position: relative
  height: auto
  overflow-x: hidden
  animation: blur 60s linear infinite alternate
  #indexWrap
    max-width: 1000px
    display: block
    margin: 0 auto
    position: relative
    padding: 1em
    min-height: 100vh
    .normText
      font-family: Arial, Helvetica, sans-serif
    h1
      font-size: 4em
      text-align: center
      background-color: rgba(255,0,0,.780392)
      border-radius: .5em
      padding: .5em .25em
      color: #fff
      text-transform: uppercase
      box-shadow: 0 -1px 2px #f0f, 0 1px 2px #ff0
      text-shadow: 0 -1px 2px #f0f, 0 1px 2px #ff0
    h2
      font-size: 1.5em
      margin-top: 1em
    #cautionBox
      background-color: white
      color: black
      margin-top: 1em
      padding: .5em
      //border-radius: 1em
      font-size: 1em
      display: inline-block
      filter: shadowMode(white)
      width: calc(50% - 2em)
      @include tablet
        width: -webkit-fill-available
        display: inline-block
      b
        font-weight: 600
      h2
        background-color: #ffe600
        filter: shadowMode(#ffe600)
        text-align: center
        padding: .25em
        color: white
        margin: 0
        margin-bottom: .5em
        font-weight: 800
        //border-radius: .5em
        @include mobile
          font-size: 1em
    #instructions
      @extend #cautionBox
      h2
        background-color: $CYOARED
        color: white
        text-transform: uppercase
        filter: shadowMode($CYOARED)
      span
        display: block
      i
        font-style: italic
      div
        text-align: center
      @include tablet
        display: none
    .albumBox
      display: block
      margin-top: 1em
      position: relative
      margin: 1em auto 2em auto
      width: 100%
      transition: width .25s
      padding-bottom: .5em
      border-bottom: 2px solid #000
      animation: fadeIn linear .5s
      opacity: 0
      animation-fill-mode: forwards
      @include tablet
        text-align: center
      &:last-of-type
        border-bottom: 0px
        padding-bottom: 0
      img
        width: 25%
        position: absolute
        transition: width .25s
        &:hover
          filter: brightness(0.8)
        @include tablet
          margin-left: 0
          position: inherit
          width: 50%
        @include mobile
          width: 75%
      a
        color: black
        &:visited
          color: black
      .info
        display: inline-block
        vertical-align: top
        margin-left: calc(25% + 1em)
        margin-bottom: 1em
        width: calc(75% - 1em)
        @include tablet
          margin-left: 0
          width: 100%
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

@keyframes fadeIn
  from
    opacity: 0 
  to
    opacity: 1

@keyframes blur
  0%
    -webkit-filter: blur(0px)
  50%
    -webkit-filter: blur(0px)
  100%
    -webkit-filter: blur(0px)
</style>
