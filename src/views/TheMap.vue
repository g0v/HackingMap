<template>
  <div id="theMap">
    <svg id="svg">
      <!-- <image :xlink:href="mapSrc" x="0" y="0" height="" width="50px"/> -->
      <image :xlink:href="mapSrc" x="0" y="0" :width="mapWidth"/>
      <template v-for="project in onBoardProjects">
        <g 
          :id="`project_${project['.key']}`"
          class="projectNode"
          :transform="`translate(${project.position.x},${project.position.y})`"
          :key="project['.key']"
          @click="() => { handleClick(project['.key']) }"
          @mouseover="() => { handleHover(project['.key']) }"
        >
          <circle />
          <text>{{project.name}}</text>
        </g>
      </template>
    </svg>
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
  computed: {
    onBoardProjects() {
      // TODO: filter if poject has position info
      return this.projects
    },
  },
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
  methods: {
    handleClick(key) {
      console.log(`handleClick(${key})`)
    },
    handleHover(key) {
      console.log(`handleHover(${key})`)
    },
  },
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

g.projectNode {
  circle {
    r: 30;
    fill: white;
    opacity: 0.8;
    stroke: #CCC;
    stroke-width: 2;
  }
  text {
    text-anchor: middle;
    dominant-baseline: middle;
    font-size: 8px;
    font-family: 'Monospace';
    fill: #536469;
  }
}


</style>
