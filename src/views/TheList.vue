<template>
  <div id="theList">
    <el-collapse v-model="active" accordion>
      <template v-for="(project, key) in projects">
        <el-collapse-item :title="project.name" :name="key">
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
            <el-button size="mini" icon="el-icon-location" round> Map </el-button>
            <el-button size="small" icon="el-icon-edit-outline" round> Edit </el-button>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>
  
<script>
import { db } from '@/service/firebase'
import { detailTypes } from '@/config/detailTypes'

export default {
  name: 'TheList',
  firebase: {
    projects: db.ref('projects'),
  },
  data() {
    return {
      active: null,
      ready: false,
      detailTypes,
    }
  },
  computed: {},
  methods: {},
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
