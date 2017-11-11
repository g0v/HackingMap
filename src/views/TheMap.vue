<template>
  <div id="theMap">
    <svg id="svg">
      <!-- <image :xlink:href="mapSrc" x="0" y="0" height="" width="50px"/> -->
      <image :xlink:href="mapSrc" x="0" y="0" :width="mapWidth"/>
    </svg>
    <!-- <img :src="mapSrc" :width="mapWidth" alt="background"> -->
  </div>
</template>
  
<script>
import { db, storage } from '@/service/firebase'

export default {
  name: 'TheMap',
  firebase: {
    projects: db.ref('projects'),
  },
  data() {
    return {
      mapSrc: '',
      mapWidth: '',
      ready: false,
    }
  },
  computed: {},
  created() {
    db
      .ref('map')
      .child('width')
      .once('value')
      .then(snapshot => (this.mapWidth = snapshot.val() || '800' + 'px'))

    storage
      .ref('map/background.png')
      .getDownloadURL()
      .then(url => (this.mapSrc = url))
      .catch(err => console.error(err))
  },
  methods: {},
  components: {},
}
</script>

<style lang="scss" scoped>
#theMap {
}

#svg {
  // width: 100vw;
  // height: 100vh;
  width: 2000px;
  height: 2000px;
}
</style>
