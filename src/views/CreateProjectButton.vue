<template>
  <section class="CreateProjectButton">

    <!-- Dialog toggle button -->
    <el-button type="primary" @click="dialogVisible = true">編輯專案</el-button>

    <!-- Dialog -->
    <el-dialog
      title="編輯專案"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >

      <!-- Form -->
      <ProjectEditor @cancel="dialogVisible = false"/>

    </el-dialog>

  </section>
</template>

<script>
import ProjectEditor from '@/views/ProjectEditor'

export default {
  name: 'CreateProjectButton',
  data() {
    return {
      dialogVisible: true,
    }
  },
  components: {
    ProjectEditor,
  },
}
</script>

<style scoped>
  /* .CreateProjectButton {} */
</style>
