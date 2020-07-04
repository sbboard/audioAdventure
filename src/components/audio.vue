<template>
  <div id="root">
    <div id="wrap">
      <h1>{{this.audioInfo.name}}</h1>

      <audio autoplay @ended='ended' ref="audio" @timeupdate="timeCheck()">
      <source :src="'/audio/'+album+'/'+audioInfo.source" type="audio/mpeg">
      </audio>

      <audio ref="sfx">
      <source src="/audio/sys/press.mp3" type="audio/mpeg">
      </audio>

      <div id="controls">
      <img v-if="audioInfo.name != 'loading'" @click="setIndex('f')" src="../assets/f.png" :class="{pressed: fpressed, faded: !optionTime}">
      <img @click="togglePlay()" v-if="play" src="../assets/pause.png">
      <img @click="togglePlay()" v-if="!play" src="../assets/play.png">
      <img v-if="audioInfo.name != 'loading'" @click="replay()" src="../assets/replay.png">
      <img v-if="audioInfo.name != 'loading'" @click="setIndex('j')" src="../assets/j.png" :class="{pressed: jpressed, faded: !optionTime}">
      </div>
    </div>
    <div v-if="audioInfo.f == '' && audioInfo.j == '' && endhit == true && audioInfo.name != 'loading'">
      <router-link :to="'/replay/'+album+'/'+pathprint">Relisten to Adventure</router-link>
    </div>
  </div>
</template>

<script>

export default {
  data(){
    return{
        localPlaylist: null,
        songIndex: this.$route.params.id,
        audioInfo: {
          "source": "notFound.mp3",
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
    }
  },
  methods: {
    togglePlay(){
      if(this.play){
        this.$refs.audio.pause()
      }
      else{
        this.$refs.audio.play()
      }
      this.play = !this.play
    },
    replay(){
      this.$refs.audio.currentTime = 0
    },
    ended(){
        this.endhit = true
        this.$refs.audio.currentTime = this.audioInfo.endTime
        this.$refs.audio.play()
    },
    setIndex(value){
      if(this.optionTime == true){
        this.$refs.sfx.play()
        this.endhit = false
        let index = this.audioInfo[value]
        if(index != ''){
          this.$router.push({ path: `/${this.album}/${index}`})
          this.songIndex = index
          let remotePlay= this.playlist
          let albumList = remotePlay.albums
          if(typeof albumList[0].tracks[this.songIndex] != 'undefined') {
            this.audioInfo = albumList[0].tracks[this.songIndex]
            this.$refs.audio.src = "/audio/"+this.album+'/'+this.audioInfo.source;
          }
          this.currentPath.push(this.songIndex)
          this.optionTime = false
        }
      }
    },
      timeCheck(){
        if(this.$refs.audio.currentTime >= this.audioInfo.endTime){
          if(this.audioInfo.j != "" && this.audioInfo.f != "")
          this.optionTime = true
        }
      },
  },
  computed: {
    playlist() {
      return this.$store.getters.getPlaylist
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
      if(typeof albumList[0].tracks[this.songIndex] != 'undefined') {
        this.audioInfo = albumList[0].tracks[this.songIndex]
      } 
    },
    audioInfo(){
      let remotePlay= this.playlist
      let albumList = remotePlay.albums
      this.$refs.audio.pause();

      if(typeof albumList[0].tracks[this.songIndex] != 'undefined') {
        this.audioInfo = albumList[0].tracks[this.songIndex]
        this.$refs.audio.src = "/audio/"+this.album+'/'+this.audioInfo.source;
      }
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play()
    }
  },
}
</script>

<style lang="sass">
#root
    #controls
        img
            display: black
            width: 50px
            cursor: pointer
        .faded
          opacity: .5
          cursor: auto
.pressed
  height: 47px
  width: 47px
  filter: brightness(0.75) drop-shadow(0px -1px 4px black)
</style>
