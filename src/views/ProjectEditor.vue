<template>
  <section class="ProjectEditor">

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
import ProjectEditorForm from '../components/ProjectEditorForm.vue'

export default {
  name: 'ProjectEditor',
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
  /* .ProjectEditor {} */
</style>
