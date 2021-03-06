<template>
  <div id="theMap">
    <svg id="svg"
      v-stream:mousedown = "mouseDown$"
      v-stream:mouseup = "mouseUp$"
      v-stream:mousemove = "mouseMove$"
      v-stream:mouseleave = "mouseLeave$"
      :cursor="cursor"
    >
      <!-- <image :xlink:href="mapSrc" x="0" y="0" height="" width="50px"/> -->
      <image class="background" :xlink:href="mapSrc" x="0" y="0" :width="mapWidth" :height="mapWidth"/>
      <g
        id="tempNode"
        style="cursor: -webkit-grabbing;"
        :opacity="tempNode.show ? 1 : 0"
        :transform="`translate(${tempNode.x}, ${tempNode.y})`"
        cursor="move"
      >
        <circle r="30"/>
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
          <circle :r="project['.key'] == activeProjectKey ? 35 : 30"/>
          <text>{{project.name}}</text>
          <g
            v-if="project.detail && project.detail.recruiting" 
            :transform="project['.key'] == activeProjectKey ? 'translate(25, -25)' : 'translate(21, -21)'"
          >
            <circle fill="red" r="10"/>
            <text fill="white" x="-6" y="4" font-size="12">徵</text>
          </g>
        </g>
      </template>

      <!-- Copy active project's <g> node here to display it on top of all other nodes -->
      <use :xlink:href="`#project_${activeProjectKey}`" style="cursor: move;"/>

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
      .then(snapshot => (this.mapWidth = snapshot.val() || '800') + 'px')

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

        down.purpose = this.activeProject ? 'move' : 'none'

        switch (down.purpose) {
          case 'move': {
            this.tempNode.show = true
            const nodeKey = this.activeProject['.key']
            const { x, y } = this.activeProject.position
            down.info = { x, y, nodeKey }
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
        nodeKey: down.info.nodeKey,
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
    transition: 0.5s;
  }

  > circle {
    fill: white;
    stroke: #CCC;
    stroke-width: 2;
  }
  > text {
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


    > circle {
      stroke: #fe6969;
      stroke-width: 3;
      opacity: 0.9;
      animation: stroke-blinker 1.5s ease-in infinite;
    }
    > text {
      font-size: 14px;
    }
  }
}

g#tempNode {
  circle {
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
