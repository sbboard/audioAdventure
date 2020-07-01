<template>
  <div id="root">
    <div id="wrap">
      <h1>{{this.audioInfo.name}}</h1>
      <audio autoplay @ended='ended' ref="audio">
      <source :src="'/audio/'+this.audioInfo.source" type="audio/mpeg">
      </audio>
      <div id="controls">
      <img v-if="audioInfo.f != ''"  @click="setIndex('f')" src="../assets/f.png">
      <img @click="togglePlay()" v-if="play" src="../assets/pause.png">
      <img @click="togglePlay()" v-if="!play" src="../assets/play.png">
      <img v-if="audioInfo.j != ''" @click="setIndex('j')" src="../assets/j.png">
      </div>
    </div>
    <div v-if="audioInfo.f == '' && audioInfo.j == ''">
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
        album: this.$route.params.album
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
    ended(){
        this.$refs.audio.currentTime = this.audioInfo.endTime
        this.$refs.audio.play()
    },
    setIndex(value){
      let index = this.audioInfo[value]
      if(index != ''){
        this.$router.push({ path: `/${this.album}/${index}`})
        this.songIndex = index
        let remotePlay= this.playlist
        let albumList = remotePlay.albums
        if(typeof albumList[0].tracks[this.songIndex] != 'undefined') {
          this.audioInfo = albumList[0].tracks[this.songIndex]
          this.$refs.audio.src = "/audio/"+this.audioInfo.source;
        }
        this.currentPath.push(this.songIndex)
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
    window.addEventListener('keyup', function(ev) {
      let x = ev.key.toLowerCase()
      switch (x) {
        case 'f':
          that.setIndex("f")
          break;
        case 'j':
          that.setIndex("j")
          break;
        case ' ':
          that.togglePlay()
          break;
      }
    });
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
        this.$refs.audio.src = "/audio/"+this.audioInfo.source;
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
</style>
