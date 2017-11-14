<template>
  <div id="theMap">
    <svg id="svg"
      v-stream:mousedown = "mouseDown$"
      v-stream:mouseup = "mouseUp$"
      v-stream:mousemove = "mouseMove$"
      v-stream:mouseleave = "mouseLeave$"
      :style="{ cursor: cursor }"
    >
      <!-- <image :xlink:href="mapSrc" x="0" y="0" height="" width="50px"/> -->
      <image class="background" :xlink:href="mapSrc" x="0" y="0" :width="mapWidth"/>
      <g
        id="tempNode"
        :style="{ opacity: tempNode.show ? 1 : 0 }"
        :transform="`translate(${tempNode.x}, ${tempNode.y})`"
      >
        <circle />
      </g>
      <template v-for="project in onBoardProjects">
        <g 
          v-if="project.position"
          :id="`project_${project['.key']}`"
          class="projectNode"
          :class="{ activeProject: project['.key'] == activeProjectKey }"
          :transform="`translate(${project.position.x}, ${project.position.y})`"
          :key="project['.key']"
          :data-key="project['.key']"
          @mouseover="() => { handleHover(project['.key']) }"
          @mouseleave="() => { handleLeave(project['.key']) }"
        >
          <circle/>
          <text>{{project.name}}</text>
        </g>
      </template>

      <g
        v-if="activeProject"
        id="project_top_node"
        class="projectNode activeProject"
        :transform="`translate(${activeProject.position.x}, ${activeProject.position.y})`"
        :data-key="activeProject['.key']"
        @mouseover="() => { handleHover(activeProject['.key']) }"
        @mouseleave="() => { handleLeave(activeProject['.key']) }"
      >
        <circle/>
        <text>{{activeProject.name}}</text>
      </g>

    </svg>
  </div>
</template>
  
<script>
import _ from 'lodash'
import Rx from 'rxjs/Rx'
import { mapState } from 'vuex'

import { db, storage } from '@/service/firebase'

function observer(label = '') {
  return {
    next: n => console.log(label, 'Next: ', n),
    error: e => console.log(label, 'Error: ', e),
    complete: c => console.log(label, c, 'Completed'),
  }
}

export default {
  name: 'TheMap',
  firebase: {
    projects: db.ref('projects'),
  },
  data() {
    return {
      cursor: '',
      mapSrc: '',
      mapWidth: '',
      ready: false,
      tempNode: {
        show: false,
        x: '20',
        y: '30',
      },
    }
  },
  computed: {
    onBoardProjects() {
      return this.projects
    },
    activeProjectIndex() {
      return _.findIndex(this.projects, f => f['.key'] == this.activeProjectKey)
    },
    activeProject() {
      return this.projects[this.activeProjectIndex]
    },
    ...mapState(['activeProjectKey']),
  },
  subscriptions() {
    // declare the receiving Subjects
    this.mouseDown$ = new Rx.Subject().pluck('event')
    this.mouseUp$ = new Rx.Subject().pluck('event')
    this.mouseMove$ = new Rx.Subject().pluck('event')
    this.mouseLeave$ = new Rx.Subject().pluck('event')

    return {}
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
  mounted() {
    const mouseTracker$ = this.mouseDown$
      // .pluck('event')
      .map(down => {
        // console.log({ down })
        const nodeDOM = down.target.closest('g.projectNode')
        const svgDOM = down.target.closest('svg')

        down.purpose = nodeDOM ? 'move' : 'none'

        switch (down.purpose) {
          case 'move': {
            this.tempNode.show = true
            const [x, y] = nodeDOM.getAttribute('transform').match(/-?\d+/g)
            down.info = { x, y, nodeDOM }
            break
          }
        }

        // console.log('down purpose : ', down.purpose, down.info)

        return this.mouseMove$
          .takeUntil(this.mouseUp$.merge(this.mouseLeave$))
          .map(move => ({ move, down }))
          .combineLatest(
            // get the lastest mouse up event
            this.mouseUp$
              .merge(this.mouseLeave$)
              .mapTo(true)
              .first()
              .startWith(false),
            ({ move, down }, up) => ({ move, down, up })
          )
      })
      .concatAll()
      .do(({ move, down }) => {
        // console.log('mouseTracker$', { move, down })

        // prevent text/element selection with cursor drag
        down.preventDefault()
        move.preventDefault()
        down.stopPropagation()
        move.stopPropagation()
      })
      .share()

    const moveNode$ = mouseTracker$
      .filter(({ down }) => down.purpose == 'move')
      .do(({ down, move }) => {
        // console.log('moveNode$', { move, down })
      })
      // .throttleTime(30) // limit execution times for opt performance
      .map(({ down, move, up }) => ({
        nodeKey: down.info.nodeDOM.getAttribute('data-key'),
        x: Number(down.info.x) + (move.clientX - down.clientX),
        y: Number(down.info.y) + (move.clientY - down.clientY),
        up,
      }))
      .map(({ nodeKey, x, y, up }) => ({
        nodeKey,
        x: x < 50 ? 50 : x,
        y: y < 50 ? 50 : y,
        up,
      }))
      .do(({ nodeKey, x, y }) => {
        // console.log("moveTempNode", {x, y})
        this.tempNode.x = x
        this.tempNode.y = y
      })
      .filter(({ up }) => up)
      .do(({ nodeKey, x, y }) => {
        console.log('moveNode', { nodeKey, x, y })

        this.tempNode.show = false

        const newPosition = { x, y }
        const moveNode = { nodeKey, newPosition }

        this.moveNode(moveNode)
      })

    this.$subscribeTo(moveNode$, ...observer('moveNode$'))
  },
  methods: {
    handleHover(key) {
      // console.log(`handleHover(${key})`)

      this.cursor = 'move'
      this.$store.commit('setActiveProjectKey', key)
    },
    handleLeave(key) {
      // console.log(`handleLeave(${key})`)

      this.cursor = ''
    },
    moveNode({ nodeKey, newPosition }) {
      // console.log('moveNode()', { nodeKey, newPosition })

      this.$firebaseRefs.projects
        .child(nodeKey)
        .child('position')
        .set(newPosition)
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

.background {
  opacity: 0.4;
}

g.projectNode {
  > * {
    opacity: 0.7;
  }

  circle {
    r: 30;
    fill: white;
    stroke: #CCC;
    stroke-width: 2;
    transition: 0.3s;
  }
  text {
    text-anchor: middle;
    dominant-baseline: middle;
    font-size: 8px;
    font-family: 'Monospace';
    fill: #536469;
  }

  &.activeProject {
    > * {
      opacity: 0.9;
    }

    circle {
      stroke-width: 3;
      opacity: 0.9;
      r: 35;
      animation: stroke-blinker 1.5s ease-in infinite;
    }
    text {

    }

  }
}

g#tempNode {
  circle {
    r: 30;
    fill: white;
    opacity: 0.7;
    stroke: #CCC;
    stroke-width: 2;
    stroke-dasharray: 4, 8;
    stroke-linecap: round;
  }
}

@keyframes stroke-blinker {  
  50% { stroke-opacity: 0.65; }
}
</style>
