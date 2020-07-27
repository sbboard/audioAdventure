<template>
  <div id="root">
    <div id="wrap">
      <div id="casetteWrap">
        <h1>{{this.audioInfo.name}}</h1>
        <img alt="casette tape" :src="'/audio/'+album+'/casette.jpg'">
      </div>
      <audio autoplay @ended='ended' ref="audio" @timeupdate="timeCheck()">
      <source :src="'/audio/'+album+'/'+audioInfo.source" type="audio/mpeg">
      </audio>

      <audio ref="sfx">
      <source src="/audio/sys/press.mp3" type="audio/mpeg">
      </audio>

      <div id="controls">
      <img alt="f-key" v-if="audioInfo.name != 'Blank Tape'" @click="setIndex('f')" src="../assets/f.png" :class="{pressed: fpressed, faded: !optionTime}">
      <i v-if="audioInfo.name != 'Blank Tape'" @click="replay()" class="fas  fa-4x fa-backward"></i>
      <i @click="togglePlay()" v-if="play" class="fas fa-4x fa-pause"></i>
      <i @click="togglePlay()" v-if="!play" class="fas fa-4x fa-play"></i>
      <i @click="eject()" class="fas fa-4x fa-eject"></i>
      <i @click="action()" class="fas fa-4x fa-bolt"></i>
      <img alt="j-key" v-if="audioInfo.name != 'Blank Tape'" @click="setIndex('j')" src="../assets/j.png" :class="{pressed: jpressed, faded: !optionTime}">
      </div>
    </div>
    <div id="endMenu" :class="{hiddenSpot: hiddenSpotCheck}">
      <a :href="'/'+album+'/1'">Restart Adventure</a>
      <router-link :to="'/replay/'+album+'/'+pathprint">Relisten to Adventure</router-link>
    </div>
    <footer><i class="fas fa-copyright"></i> <a href="http://www.theinvisiblesundial.com/">invisible sundial</a> x <a href="https://gang-fight.com/">gang fight</a></footer>
  </div>
</template>

<script>

export default {
  data(){
    return{
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
        album: this.$route.params.album,
        endhit: false,
        jpressed: false,
        fpressed: false,
        optionTime: false,
        inventory: {},
        itemList: [],
        trackKeysRecieved: [],
        devMode: process.env.VUE_APP_DEV,
        ejected: false,
        doorInWing: null,
        altTriggered: false,
    }
  },
  methods: {
    eject(){
      if(this.ejected == false){
      this.audioInfo.f = ''
      this.audioInfo.j = ''
      this.endhit = true
      this.$refs.audio.src = ""
      this.ejected = true
      this.$refs.sfx.src = "/audio/sys/eject.mp3"
      this.$refs.sfx.play()
      }
    },
    togglePlay(){
      if(this.play){
        this.$refs.audio.pause()
      }
      else{
        this.$refs.audio.play()
      }
      this.play = !this.play
    },
    action(){
      //if there's a key
      if(this.audioInfo.key != null && this.trackKeysRecieved.indexOf(this.songIndex)<0){
        this.inventory[this.itemList[this.audioInfo.key].itemName] = this.inventory[this.itemList[this.audioInfo.key].itemName]+1
        //check for autodoor
        if(this.itemList[this.audioInfo.key].autoDoor != null 
        && this.inventory[this.itemList[this.audioInfo.key].itemName] >= this.itemList[this.audioInfo.key].autoDoor.keysNeededForAutoDoor){
          this.doorInWing = this.itemList[this.audioInfo.key].autoDoor.autoDoorLocation
        }

        this.trackKeysRecieved.push(this.songIndex)
        this.$refs.sfx.src = "/audio/sys/action.mp3"
        this.$refs.sfx.play()
      }
      //if there's a door
      else if(this.audioInfo.door != null){
        if(this.inventory[this.itemList[this.audioInfo.door.objectRequired].itemName] >= this.audioInfo.door.numberRequired){
          let index = this.audioInfo.door.doorDestination
          this.pushDoor(index)
          this.$refs.sfx.src = "/audio/sys/action.mp3"
          this.$refs.sfx.play()
        }
      }
    },
      pushDoor(index){
        this.doorInWing = null
        this.$router.push({ path: `/${this.album}/${index}`})
        this.songIndex = index
        let remotePlay= this.playlist
        let albumList = remotePlay.albums
        this.audioInfo = albumList[this.album].tracks[this.songIndex]
        this.$refs.audio.src = "/audio/"+this.album+'/'+this.audioInfo.source
        this.currentPath.push(this.songIndex)
        this.optionTime = false
      },
    replay(){
      this.$refs.audio.currentTime = 0
    },
    ended(){
        this.endhit = true
        if(this.altTriggered == false){
        this.$refs.audio.currentTime = this.audioInfo.endTime
        }
        else{
          this.$refs.audio.currentTime = this.audioInfo.altTrack.endTime
        }
        this.$refs.audio.play()
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
          let remotePlay= this.playlist
          let albumList = remotePlay.albums
          if(typeof albumList[this.album].tracks[this.songIndex] != 'undefined') {
            this.audioInfo = albumList[this.album].tracks[this.songIndex]
          }
          else{
            this.audioInfo.name = "Blank Tape"
            this.$refs.audio.src = "/audio/"+this.album+'/'+albumList[this.album].notFoundTrack
          }
          //checks if keys been recieved, pushes alt track to array
          if(this.trackKeysRecieved.indexOf(this.songIndex)>=0 && this.audioInfo.key.altTrack != null){
            this.currentPath.push(this.songIndex+"alt")
          }
          else{
            this.currentPath.push(this.songIndex)
          }
          this.optionTime = false
        }
      }
    },
    createInventory(inventoryItems){
      this.itemList = inventoryItems
      for(let i=0;i<inventoryItems.length;i++){
        this.inventory[inventoryItems[i].itemName] = 0
      }
    },
    timeCheck(){
      if(this.altTriggered == false){
        if(this.$refs.audio.currentTime >= this.audioInfo.endTime){
          if(this.audioInfo.j != "" && this.audioInfo.f != ""){
            if(this.doorInWing != null){
              this.pushDoor(this.doorInWing)
            }else{this.optionTime = true}
          }
        }
      }
      else{
        if(this.$refs.audio.currentTime >= this.audioInfo.altTrack.endTime){
          if(this.audioInfo.j != "" && this.audioInfo.f != ""){
            if(this.doorInWing != null){
              this.pushDoor(this.doorInWing)
            }else{this.optionTime = true}
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
      if(this.audioInfo.f == '' && this.audioInfo.j == '' && this.endhit == true && this.audioInfo.name != 'Blank Tape'){
        return false
      }
      else{
        return true
      }
    },
    pathprint(){
      let printedPath = ""
      for(let i = 0; i<this.currentPath.length;i++){
        printedPath += this.currentPath[i] + "+"
      }
      printedPath = printedPath.slice(0,printedPath.length-1)
      return printedPath
    }
  },
  beforeMount(){
    if(this.playlist != null){
      this.localPlaylist = this.playlist.albums[this.album]
      if(typeof this.localPlaylist.tracks[this.songIndex] != 'undefined') {
        this.audioInfo = this.localPlaylist.tracks[this.songIndex]
      }
      else{
            this.audioInfo.name = "Blank Tape"
            this.audioInfo.source = this.localPlaylist.notFoundTrack
      }
      this.createInventory(this.localPlaylist.inventoryItems)
    }
  },
  mounted(){
    let that = this
    this.currentPath.push(this.songIndex)
    window.addEventListener('keydown', function(ev) {
      let x = ev.key.toLowerCase()
      switch (x) {
        case 'f':
          if(that.optionTime == true){that.fpressed = true}
          break;
        case 'k':
          that.replay()
          break;
        case 'd':
          that.replay()
          break;
        case 'j':
          if(that.optionTime == true){that.jpressed = true}
          break;
        case 'g':
          that.action()
          break;
        case 'h':
          that.action()
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
      let remotePlay= this.playlist
      let albumList = remotePlay.albums
      if(typeof albumList[this.album].tracks[this.songIndex] != 'undefined') {
        this.audioInfo = albumList[this.album].tracks[this.songIndex]
      }
      else{
          this.audioInfo.name = "Blank Tape"
          this.audioInfo.source = albumList[this.album].notFoundTrack

          //i dont know why only this part doesn't load right without the following code
          this.$refs.audio.src = "/audio/"+this.album+'/'+this.audioInfo.source;
          this.$refs.audio.play()
      }
      this.createInventory(albumList[this.album].inventoryItems)
    },
    audioInfo(){
      this.$refs.audio.pause();
      if(this.audioInfo.invCheck != null && this.audioInfo.invCheck.numberRequired <= this.inventory[this.itemList[this.audioInfo.invCheck.itemRequired].itemName]
      || this.trackKeysRecieved.indexOf(this.songIndex)>=0 && this.audioInfo.altTrack != null){
        this.$refs.audio.src = "/audio/"+this.album+'/'+this.audioInfo.altTrack.source;
        this.altTriggered = true
      }
      else{
        this.$refs.audio.src = "/audio/"+this.album+'/'+this.audioInfo.source;
        this.altTriggered = false
      }
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play()
    }
  },
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap')

#root
  max-width: 1000px
  display: block
  margin: 0 auto
  height: 100vh
  align-items: center
  display: flex
  justify-content: center
  flex-direction: column
  #casetteWrap
    text-align: center
    position: relative
    img
      max-width: 50%
    h1
      width: fit-content
      font-family: 'Permanent Marker', cursive
      position: absolute
      margin: 0 auto
      left: 0
      right: 0
      top: 3em
      color: black
  #controls
    width: fit-content
    margin: 1em auto 0 auto
    display: flex
    justify-content: space-between
    align-items: center
    width: 50%
    img
      display: black
      cursor: pointer
    .faded
      opacity: .5
      cursor: auto
    i
      cursor: pointer
.pressed
  height: 47px
  width: 47px
  filter: brightness(0.75) drop-shadow(0px -1px 4px black)
.hiddenSpot
  visibility: hidden
#endMenu
  display: flex
  width: 50%
  margin-top: 1em
  justify-content: space-around
  font-size: 1.25em
  a
    color: white
    width: 20%
    text-align: center
</style>
