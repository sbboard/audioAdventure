<template>
    <div id="rootWrap">
  <div id="root">
    <template v-if="loaded">
    <h1 id="topTitle"><a href="/">1000 Tapes of Fate</a></h1>
    <div id="wrap">
      <div id="casetteWrap">
      <img alt="casette player" src="../assets/cass3.png">
      </div>

      <audio @play="tagOverlay()" autoplay v-if="(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null && this.trackKeysRecieved.indexOf(parseInt(this.songIndex))<0)" 
      ref="overlay" @ended='overlayLoop'>
      <source :src="'/audio/'+this.albumLocation+'/'+this.audioInfo.key.overlaySound" type="audio/mpeg">
      </audio>

      <template v-if="audioInfo.name != 'Blank Tape'">
        <audio autoplay @ended='ended' ref="audio" @timeupdate="timeCheck()">
        <source :src="'/audio/'+albumLocation+'/'+audioInfo.source" type="audio/mpeg">
        </audio>
      </template>
      <template v-else>
        <audio autoplay @ended='ended' ref="audio" @timeupdate="timeCheck()">
        <source src='/audio/sys/404tape.mp3' type="audio/mpeg">
        </audio>
      </template>

      <audio ref="sfx" id="sfx">
      <source src="/audio/sys/press.mp3" type="audio/mpeg">
      </audio>

      <div id="controls" v-if="!ejected">
        <img id="ejecter" @click="eject()" src="../assets/keys/esc.png">
        <img v-if="audioInfo.name != 'Blank Tape'" @click="replay()" src="../assets/keys/D.png">
        <img alt="f-key" v-if="audioInfo.name != 'Blank Tape'" @click="setIndex('f')" src="../assets/keys/F.png" :class="{pressed: fpressed, faded: !optionTime}">
      
        <img @click="action()" v-if="audioInfo.name != 'Blank Tape'" src="../assets/keys/G.png">

        <img @click="togglePlay()" v-if="play" src="../assets/keys/centerPause.png">
        <img @click="togglePlay()" v-if="!play" src="../assets/keys/centerPlay.png">

        <img @click="action()" v-if="audioInfo.name != 'Blank Tape'" src="../assets/keys/H.png">
        
        <img alt="j-key" v-if="audioInfo.name != 'Blank Tape'" @click="setIndex('j')" src="../assets/keys/J.png" :class="{pressed: jpressed, faded: !optionTime}">
        
        <img v-if="audioInfo.name != 'Blank Tape'" @click="replay()" src="../assets/keys/K.png">
        <img id="ejectInv" src="../assets/keys/esc.png">
      </div>

      <div id="endMenu" :class="{hiddenSpot: hiddenSpotCheck}">
        <div @click="setupRestart()">Restart Adventure</div>
        <router-link :to="'/replay/'+album+'/'+pathprint">Relisten to Adventure</router-link>
      </div>

    </div>
    <footer><i class="fas fa-copyright"></i> <a href="http://www.theinvisiblesundial.com/">invisible sundial</a> x <a href="https://gang-fight.com/">gang fight</a></footer>
    </template>
    <template v-else>
      Loading...
      </template>
  </div>
  <div id="burn"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
        loaded: false,
        localPlaylist: null,
        songIndex: this.$route.params.id,
        audioInfo: {
          "source": "",
          "name": "loading",
          "endTime": "",
          "f": "",
          "j": ""
        },
        play: true,
        currentPath: [],
        pathToPush: [],
        album: this.$route.params.album,
        albumLocation: null,
        endhit: false,
        jpressed: false,
        fpressed: false,
        optionTime: false,
        inventory: {},
        defaultList: {},
        itemList: [],
        trackKeysRecieved: [],
        devMode: process.env.VUE_APP_DEV,
        ejected: false,
        doorInWing: null,
        altTriggered: false,
        trackList: null,
        trackToPush: null
    }
  },
  methods: {
    eject(){
      if(this.audioInfo.name=="Blank Tape"){
        this.$router.push({ path: `/`})
      }
      if(this.ejected == false){
        this.$refs.audio.src = ""
        this.pathToPush.push(this.trackToPush)
        this.ejected = true
        this.$refs.sfx.src = "/audio/sys/eject.mp3"
        if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null && this.trackKeysRecieved.indexOf(parseInt(this.songIndex))<0){
          this.$refs.overlay.pause()
        }
        this.$refs.sfx.play()
      }
    },
    setupRestart(){
      this.pathToPush = []
      this.ejected = false
      this.trackKeysRecieved = []
      this.getAlbumInfo()
      this.pushDoor(1)
    },
    overlayLoop(){
      this.$refs.overlay.currentTime = 0
      this.$refs.overlay.play()
    },
    togglePlay(){
        this.$refs.sfx.src = "/audio/sys/press.mp3"
        this.$refs.sfx.play()
      if(this.play){
        this.$refs.audio.pause()
        if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null && this.trackKeysRecieved.indexOf(parseInt(this.songIndex))<0){this.$refs.overlay.pause()}
      }
      else{
        this.$refs.audio.play()
        if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null && this.trackKeysRecieved.indexOf(parseInt(this.songIndex))<0){this.$refs.overlay.play()}
      }
      this.play = !this.play
    },
    tagOverlay(){
      this.trackToPush += "overlay"
    },
    action(){
      //if there's a key
      if(this.audioInfo.key != null && this.trackKeysRecieved.indexOf(parseInt(this.songIndex))<0 && this.belowMax(this.audioInfo.key.keyIndex)){
        this.inventory[this.itemList[this.audioInfo.key.keyIndex].itemName] = this.inventory[this.itemList[this.audioInfo.key.keyIndex].itemName]+1
        //check for autodoor
        if(this.itemList[this.audioInfo.key.keyIndex].autoDoor != null 
        && this.inventory[this.itemList[this.audioInfo.key.keyIndex].itemName] >= this.itemList[this.audioInfo.key.keyIndex].autoDoor.keysNeededForAutoDoor){
          this.doorInWing = this.itemList[this.audioInfo.key.keyIndex].autoDoor.autoDoorLocation
        }
        this.trackKeysRecieved.push(parseInt(this.songIndex))
        this.$refs.sfx.src = "/audio/sys/action.mp3"
        this.$refs.sfx.play()
        if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null){
          let that = this
          this.trackToPush += Math.floor(that.$refs.audio.currentTime)
          this.$refs.overlay.src = ""
        }
      }
      //if there's a door
      else if(this.audioInfo.door != null){
        if(this.inventory[this.itemList[this.audioInfo.door.objectRequired].itemName] >= this.audioInfo.door.numberRequired){
          let index = this.audioInfo.door.doorDestination
          this.pushDoor(index)
          this.$refs.sfx.src = "/audio/sys/action.mp3"
          this.$refs.sfx.play()
        }
        else{
          this.$refs.sfx.src = "/audio/sys/failed.mp3"
          this.$refs.sfx.play()
        }
      }
      else{    
        if(this.$refs.sfx.currentTime ==this.$refs.sfx.duration){
          this.$refs.sfx.src = "/audio/sys/failed.mp3"
          this.$refs.sfx.play()
        }
      }
    },
    belowMax(keydex){
      if(this.itemList[keydex].maxAmt == null || this.inventory[this.itemList[keydex].itemName] < this.itemList[keydex].maxAmt){
        return true
      }
      else{
        return false
      }
    },
    pushDoor(index){
      this.doorInWing = null
      this.$router.push({ path: `/${this.album}/${index}`})
      this.songIndex = index
      this.audioInfo = this.trackList[this.songIndex]
      this.$refs.audio.src = "/audio/"+this.albumLocation+'/'+this.audioInfo.source
      this.optionTime = this.currentPath.indexOf(index) > -1 ? true : false
      this.currentPath.push(this.songIndex)
    },
    replay(){
      this.$refs.sfx.src = "/audio/sys/press.mp3"
      this.$refs.sfx.play()
      this.$refs.audio.currentTime = 0
    },
    ended(){
        this.endhit = true
        if(this.audioInfo.f=='' && this.audioInfo.j ==''&& this.pathToPush.indexOf(this.trackToPush)<0){
          this.pathToPush.push(this.trackToPush)
        }
        if(this.altTriggered == false){
          this.$refs.audio.currentTime = this.audioInfo.endTime
        }
        else{
          this.$refs.audio.currentTime = this.audioInfo.altTrack.endTime
        }
        this.$refs.audio.play()
        this.play = true
    },
    getAlbumInfo(){
      axios.get(`/audio/${this.$store.getters.getPlaylist.albums[this.album].folder}/info.json`)
      .then((response) => {
            this.loaded = true
          this.trackList = response.data.tracks
          this.albumLocation = this.$store.getters.getPlaylist.albums[this.album].folder

          if(this.songIndex < this.trackList.length) {
            this.audioInfo = this.trackList[this.songIndex]
          }
          else{
             this.audioInfo = {
          "source": "/audio/sys/404tape.mp3",
          "name": "Blank Tape",
          "endTime": "",
          "f": "",
          "j": ""
        }
           }
        this.createInventory(response.data.inventoryItems)
      })
    },
    setIndex(value){
      if(this.optionTime == true || this.devMode == "true" ){
        this.$refs.sfx.src = "/audio/sys/press.mp3"
        this.$refs.sfx.play()
        this.endhit = false
        let index = this.audioInfo[value]
        if(index != ''){
          this.$router.push({ path: `/${this.album}/${index}`})
          this.songIndex = index
          this.audioInfo = this.trackList[this.songIndex]
          if(this.currentPath.indexOf(this.songIndex) > -1){
            this.optionTime = true
          }
          else{
            this.optionTime = false
          }
          this.currentPath.push(this.songIndex)
        }
      }
    },
    createInventory(inventoryItems){
      this.itemList = inventoryItems
      for(let i=0;i<inventoryItems.length;i++){
        this.inventory[inventoryItems[i].itemName] = 0
      }
      this.defaultList = this.inventory
    },
    timeCheck(){
      //random jump check
      if(this.$refs.audio.currentTime > 3 && this.audioInfo.randomJump != null && this.audioInfo.randomJump > this.$refs.audio.currentTime){
        let random = Math.floor(Math.random() * 20);
        if(random == 0){
          this.$refs.audio.currentTime = this.audioInfo.randomJump
        }
      }
      //activates optionTime / pushes door
      if(this.altTriggered == false){
        if(this.$refs.audio.currentTime >= this.audioInfo.endTime){
          if(this.audioInfo.j != "" && this.audioInfo.f != ""){
            if(this.doorInWing != null){
              this.pushDoor(this.doorInWing)
            }else{
              if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null && this.trackKeysRecieved.indexOf(parseInt(this.songIndex))<0){this.$refs.overlay.src = ""}
              this.optionTime = true
            }
          }
        }
      }
      //activates optionTime / pushes door if alt track active
      else{
        if(this.$refs.audio.currentTime >= this.audioInfo.altTrack.endTime){
          if(this.audioInfo.j != "" && this.audioInfo.f != ""){
            if(this.doorInWing != null){
              this.pushDoor(this.doorInWing)
            }else{
              if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null && this.trackKeysRecieved.indexOf(parseInt(this.songIndex))<0){this.$refs.overlay.src = ""}
              this.optionTime = true
            }
          }
        }
      }
      },
  },
  computed: {
    playlist() {
      return this.$store.getters.getPlaylist
    },
    hiddenSpotCheck(){
      if(this.audioInfo.f == '' && this.audioInfo.j == '' && this.endhit == true && this.audioInfo.name != 'Blank Tape' || this.ejected == true){
        return false
      }
      else{
        return true
      }
    },
    pathprint(){
      let printedPath = ""
      for(let i = 0; i<this.pathToPush.length;i++){
        printedPath += this.pathToPush[i] + "+"
      }
      printedPath = printedPath.slice(0,printedPath.length-1)
      return printedPath
    }
  },
  beforeMount(){
    if(this.playlist != null){this.getAlbumInfo()}
  },
  mounted(){
    let that = this
    this.currentPath.push(parseInt(this.songIndex))
    window.addEventListener('keydown', function(ev) {
      let x = ev.key.toLowerCase()
      switch (x) {
        case 'f':
          if(that.optionTime == true){that.fpressed = true}
          else{
            that.$refs.sfx.src = "/audio/sys/failed.mp3"
            that.$refs.sfx.play()
          }
          break;
        case 'k':
          that.replay()
          break;
        case 'd':
          that.replay()
          break;
        case 'j':
          if(that.optionTime == true){that.jpressed = true}
          else{
        that.$refs.sfx.src = "/audio/sys/failed.mp3"
        that.$refs.sfx.play()
          }
          break;
        case 'g':
          that.action()
          break;
        case 'h':
          that.action()
          break;
        case 'escape':
          that.eject()
          break;
      }
    })
    window.addEventListener('keyup', function(ev) {
      let x = ev.key.toLowerCase()
      switch (x) {
        case 'f':
          if(that.optionTime == true){that.setIndex("f")
          that.fpressed = false}
          break;
        case 'j':
          if(that.optionTime == true){that.setIndex("j")
          that.jpressed = false}
          break;
        case ' ':
          that.togglePlay()
          break;
      }
    })
  },
  watch:{
    playlist(){
      if(this.album > this.$store.getters.getPlaylist.albums.length - 1){
        this.$router.push({ path: `/`})
      }
      else{
        this.getAlbumInfo()
      }
    },
    audioInfo(){
      if(this.trackToPush != null){this.pathToPush.push(this.trackToPush)}
      this.trackToPush = this.songIndex
      if(this.$refs.audio != undefined){
        this.$refs.audio.pause();
        if(this.audioInfo.invCheck != null && this.audioInfo.invCheck.numberRequired <= this.inventory[this.itemList[this.audioInfo.invCheck.itemRequired].itemName]
        || this.trackKeysRecieved.indexOf(parseInt(this.songIndex))>=0 && this.audioInfo.altTrack != null ||
        this.audioInfo.key != null && !this.belowMax(this.audioInfo.key.keyIndex)){
          this.$refs.audio.src = "/audio/"+this.albumLocation+'/'+this.audioInfo.altTrack.source
          if(this.audioInfo.altTrack.f != null){
            this.audioInfo.f = this.audioInfo.altTrack.f
            this.audioInfo.j = this.audioInfo.altTrack.j
          }
          this.altTriggered = true
          this.trackToPush += "alt"
        }
        else{
          this.$refs.audio.src = "/audio/"+this.albumLocation+'/'+this.audioInfo.source;
          this.altTriggered = false
        }
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play()
        this.play = true
      }
      if(this.audioInfo.autokey!=null && this.trackKeysRecieved.indexOf(this.songIndex) < 0){
        this.inventory[this.itemList[this.audioInfo.autokey].itemName] = this.inventory[this.itemList[this.audioInfo.autokey].itemName]+1
        this.trackKeysRecieved.push(this.songIndex)
      }
    }
  },
}
</script>

<style lang="sass" scoped>

@font-face
  font-family: invisibleFont
  src: url("/fonts/benga.otf")

@mixin mobile
  @media (max-width: #{700px})
      @content

#rootWrap
  background-color: #212121
  color: white
  font-family: invisibleFont
#burn
  z-index: 0
  position: absolute
  width: 100vw
  height: 100%
  margin: 0
  left: 0
  top: 0
  overflow: hidden
  background: radial-gradient(rgba(0,0,0, 0) 50%, rgb(19,19,19))
  pointer-events: none

#root
  max-width: 1000px
  display: block
  margin: 0 auto
  height: 100vh
  align-items: center
  display: flex
  justify-content: space-between
  flex-direction: column
  #topTitle
    font-size: 4em
    margin-top: .25em
    top: 0
    color: white
    a
      color: white
      text-decoration: none
    &:visited
      color: white
  #casetteWrap
    text-align: center
    position: relative
    img
      width: 100%
      pointer-events: none
      transition: width .5s
    h1
      width: fit-content
      margin: 0 auto
      left: 0
      right: 0
      top: 13%
      color: black
      @include mobile
        font-size: 2.5vw
        top: 7vw
  #controls
    width: 100%
    margin: 1em auto 0 auto
    display: flex
    justify-content: center
    align-items: center
    transition: width .5s
    @include mobile
      width: 80%
    img
      display: black
      cursor: pointer
    .faded
      opacity: .5
      cursor: auto
    #ejecter
      margin-right: auto
    #ejectInv
      opacity: 0
      cursor: inherit
      margin-left: auto
.pressed
  filter: brightness(0.75) drop-shadow(0px -1px 4px black)
.hiddenSpot
  display: none !important
#endMenu
  display: flex
  width: 100%
  margin-top: 1em
  justify-content: space-around
  font-size: 1em
  transition: width .5s
  height: 65px
  div
    color: white
    cursor: pointer
    text-decoration: underline
    height: 1em
  a
    color: white
    width: 20%
    text-align: center
    height: 1em

#controls
    img
        display: black
        height: 65px
        cursor: pointer

footer
  display: block
  text-align: center
  color: white
  margin-bottom: 1em
  a
    text-transform: uppercase
    text-decoration: none
    color: white
</style>
