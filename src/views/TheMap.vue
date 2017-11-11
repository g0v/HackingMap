<template>
  <div id="theMap">
    <img :src="mapSrc" :width="mapWidth" alt="background">
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
      .then(snapshot => (this.mapWidth = snapshot.val() || '800'))

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

</style>
