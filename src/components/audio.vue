<template>
  <div id="root">
      <h1>{{this.audioInfo.name}}</h1>
      <audio controls autoplay @ended='ended' ref="audio">
      <source :src="'./audio/'+this.audioInfo.source" type="audio/mpeg">
      </audio>
      <div id="controls">
      <a :href="audioInfo.f" v-if="audioInfo.f != ''"><img src="../assets/f.png"></a>
      <img src="../assets/pause.png">
      <img src="../assets/play.png">
      <a :href=audioInfo.j v-if="audioInfo.j != ''"><img src="../assets/j.png"></a>
      </div>
  </div>
</template>

<script>
import playlist from '../playlist.json'

export default {
  data(){
    return{
        playlist: playlist.tracks,
        songIndex: this.$route.params.id,
        projectName: "test project",
        audioInfo: {
        "source": "notFound.mp3",
        "name": "error: audio not found",
        "endTime": "",
        "f": "",
        "j": ""
    }
    }
  },
  methods: {
    ended(){
        console.log('ended')
        this.$refs.audio.currentTime = this.audioInfo.endTime
        this.$refs.audio.play()
    },
  },
  mounted(){
      if(typeof this.playlist[this.songIndex] != 'undefined') {
        this.audioInfo = this.playlist[this.songIndex]
    }
  }
}
</script>

<style lang="sass">
#root
    #controls
        img
            display: black
            width: 50px
</style>
