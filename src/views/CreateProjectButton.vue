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
      <ProjectEditorForm @cancel="dialogVisible = false"/>

    </el-dialog>

  </section>
</template>

<script>
import ProjectEditorForm from '@/views/ProjectEditorForm'

export default {
  name: 'CreateProjectButton',
  data() {
    return {
      dialogVisible: true,
    }
  },
  components: {
    ProjectEditorForm,
  },
}
</script>

<style scoped>
  /* .CreateProjectButton {} */
</style>
