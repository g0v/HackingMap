<template>
  <div id="theList">
    <el-collapse v-model="activeKey" accordion>
      <template v-for="(project, key) in projects">
        <el-collapse-item
          :title="project.name"
          :name="project['.key']"
          :ref="`projectItem_${project['.key']}`"
        >
          <p class="desc">{{project.desc}}</p>
          <div class="detail">
            <template v-for="(detail, key) in project.detail">
              <el-tooltip effect="dark" :content="detail" placement="top">
                <a 
                  class="detailButton" target="_blank" :key="key"
                  :href="detailTypes[key].prefix + detail"
                >
                  <i :class="detailTypes[key].icon"></i>
                </a>
              </el-tooltip>
            </template>
          </div>

          <div class="keywords">
            <el-tag v-for="(keyword, index) in project.keywords" size="mini" :key="index">{{keyword}}</el-tag>
          </div>
          <div class="buttons">
            <el-button 
              size="mini" round
              :icon="project.position ? 'el-icon-delete' : 'el-icon-location'"
              @click="mapButtonClick(project)"
            > Map </el-button>
            <el-button size="small" icon="el-icon-edit-outline" round> Edit </el-button>
          </div>
          <!-- <div :ref="`projectItem_${project['.key']}`"></div> -->
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>
  
<script>
import _ from 'lodash'
import { mapState } from 'vuex'

import { db } from '@/service/firebase'
import { detailTypes } from '@/config/detailTypes'

export default {
  name: 'TheList',
  firebase: {
    projects: db.ref('projects'),
  },
  data() {
    return {
      activeKey: '',
      ready: false,
      detailTypes,
    }
  },
  computed: {
    ...mapState(['activeProjectKey']),
  },
  watch: {
    activeProjectKey(key) {
      this.activeKey = this.activeProjectKey
    },
    activeKey(key) {
      this.$refs[`projectItem_${key}`][0].$el.scrollIntoView()
      this.setActiveProjectKey(key)
    },
  },
  methods: {
    setActiveProjectKey(key) {
      // console.log({ key })
      this.$store.commit('setActiveProjectKey', key)
    },
    mapButtonClick(project) {
      const key = project['.key']

      if (project.position) {
        this.$firebaseRefs.projects
          .child(key)
          .child('position')
          .remove()
      } else {
        this.$firebaseRefs.projects
          .child(key)
          .child('position')
          .set({
            x: 60,
            y: 60,
          })
      }

      this.setActiveProjectKey(key)
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
#theList {
}

.desc {
  margin: 3px 5px 15px;
}

.detailButton {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #d8dce5;
  box-sizing: border-box;
  outline: 0;
  margin: 3px;
  transition: .1s;
  padding: 11px;
  border-radius: 50%;
}

.keywords {
  margin: 15px 5px;
  .el-tag {
    margin: 5px 5px;
  }
}

.buttons {
  margin: 20px 5px 0px;
}
</style>
