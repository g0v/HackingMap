<template>
  <div id="theList">
    <el-collapse v-model="active" accordion>
      <template v-for="(project, key) in projects">
        <el-collapse-item :title="project.name" :name="key">
          <p class="desc">{{project.desc}}</p>
          <div class="detail">

          </div>

          <div class="keywords">

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

export default {
  name: 'TheList',
  firebase: {
    projects: db.ref('projects'),
  },
  data() {
    return {
      active: null,
      ready: false,
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

.buttons {
  margin: 20px 5px 0px;
}
</style>
