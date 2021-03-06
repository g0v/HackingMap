<template>
  <div id="theList">

    <!-- 新增專案欄位 -->
    <el-form class="listBlock" ref="newProjectForm" :model="newProject" :inline="true" @submit.native.prevent>
      <el-form-item prop="name" :rules="{ validator: validProjectName }">
        <el-input placeholder="專案名稱" v-model="newProject.name" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button id="createProjectButton" @click="createProject" size="small">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 各專案卡片 -->
    <el-collapse :value="activeProjectKey" @change="setActiveProjectKey" accordion>
      <template v-for="(project, key) in projects">
        <el-collapse-item
          :name="project['.key']"
          :ref="`projectItem_${project['.key']}`"
          :key="project['.key']"
        >
          <span slot="title" class="item-title">
            {{project.name}}
            <i v-if="project.position" class="icon el-icon-location-outline"></i>
          </span>
          <p class="desc">{{project.desc}}</p>
          <div class="detail">
            <template v-for="(detail, key) in project.detail">
              <el-tooltip effect="dark" :content="detail" placement="top" :key="key">
                <a 
                  class="detailButton" target="_blank"
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
            <el-button @click="setEditingProject(project)" size="small" icon="el-icon-edit-outline" round> Edit </el-button>
          </div>
          <!-- <div :ref="`projectItem_${project['.key']}`"></div> -->
        </el-collapse-item>
      </template>
    </el-collapse>

  </div>
</template>
  
<script>
import ProjectEditor from '@/views/ProjectEditor'
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
      ready: false,
      detailTypes,
      newProject: {
        name: '',
        detail: {
          note: 'https://hackmd.io/',
        },
      },
    }
  },
  computed: {
    ...mapState(['activeProjectKey']),
  },
  watch: {
    activeProjectKey(key) {
      this.$nextTick(() => {
        this.$refs[`projectItem_${key}`][0].$el.scrollIntoView()
      })
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
    },
    setEditingProject(project) {
      this.$store.commit('setEditingProject', project)
    },
    createProject() {
      if (!this.newProject.name) {
        this.$message.error('專案名稱不可為空')
        return
      }
      this.$refs['newProjectForm'].validate(valid => {
        if (valid) {
          const key = this.newProject.name
          this.$firebaseRefs.projects
            .child(key)
            .update(this.newProject)
            .then(() => {
              // TODO: Simplify this
              this.$message({ message: '建立成功', type: 'success' })
              this.setEditingProject({
                ...this.newProject,
                '.key': key,
              })
              this.newProject.name = ''
            })
            .catch(err => {
              this.$message.error('建立失敗')
            })
        } else {
          this.$message({ message: '格式有誤', type: 'warning' })
        }
      })
    },
    validProjectName: ProjectEditor.methods.validChineseLength(3, 20),
  },
}
</script>

<style lang="scss" scoped>
#theList {
}

.item-title {
  i.icon {
  }
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

.listBlock {
  padding-top: 25px;
  #createProjectButton {
    border-color: orange;

    &:hover {
      background-color: white;
      color: orange;
    }
  }
}
</style>
