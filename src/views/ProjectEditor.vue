<template>
  <el-dialog :visible.sync="dialogVisible" :show-close="true">
    <div slot="title">編輯 {{ restoreFields.name }}</div>

    <el-form 
      :model="form"
      ref="projectEditorForm"
      label-position="right"
      label-width="5rem"
    >

      <!-- Name -->
      <el-form-item 
        label="專案名稱" 
        prop="name"
        :rules="[
          { required: true, message: '此欄位為必填', trigger: 'change' },
          { min: 3, max: 30, message: '長度須介於 3 到 30 個字元', trigger: 'change' }
        ]" >
        <el-input v-model="form.name" />
      </el-form-item>

      <!-- Description -->
      <el-form-item 
        label="簡介" 
        prop="desc" 
        :rules="[
          { required: true, message: '此欄位為必填', trigger: 'change' },
          { min: 5, max: 50, message: '長度須介於 5 到 50 個字元', trigger: 'change' } 
        ]" >
        <el-input 
          v-model="form.desc" 
          type="textarea" 
          placeholder="50字內的簡單介紹。" 
          :autosize="{ minRows: 2, maxRows: 4}" />
      </el-form-item>

      <!-- Keyword -->
      <el-form-item label="標籤" prop="keywords">
        <dynamic-tags v-model="form.keywords" :max="3">+ 新增標籤</dynamic-tags>
      </el-form-item>

      <!-- Custom fields (Note, Slide ...) -->
      <el-form-item
        v-for="(item, key) in detailTypes" 
        :label="item.name"
        :key="key"
        :prop="'detail.' + key"
        :required="item.isRequired"
        :rules="{ validator: makeRegexValidator(item.format, item.formatErrorMessage, item.isRequired) }" >
        <el-input 
          v-model="form.detail[key]"
          :placeholder="item.description" 
        />
      </el-form-item>

      <!-- Submit button -->
      <el-form-item>
        <el-button
          icon="el-icon-delete" type="danger" plain
          class="float-right"
          @click="deleteProject(projectKey, $event)"
        >刪 除</el-button>
        <el-button
          icon="el-icon-upload2" type="primary" 
          class="float-left"
          @click="submitForm('projectEditorForm')" :loading="loadingSubmit"
        >儲 存</el-button>
        <el-button icon="el-icon-close" class="float-left" @click="dialogVisible = false">取 消</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script>
import DynamicTags from '@/components/DynamicTags'
import { db } from '@/service/firebase'
import { detailTypes } from '@/config/detailTypes.js'
import _ from 'lodash'

export default {
  name: 'ProjectEditor',
  components: {
    DynamicTags,
  },
  props: {
    projectKey: {
      type: String,
      required: false,
    },
  },
  firebase: {
    projects: db.ref('projects'),
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        desc: '',
        keywords: [],
        // Custom fields defined in config/detailTyoe.js
        detail: _.mapValues(detailTypes, () => ''),
      },
      loadingSubmit: false,
      formLabelWidth: '120px',
      detailTypes,
    }
  },
  computed: {
    restoreFields() {
      const project = _.find(this.projects, ['.key', this.projectKey])
      return project ? _.omit(project, '.key') : {}
    },
  },
  watch: {
    projectKey(key) {
      // Whether a projectKey is passed triggers dialog to show/hide
      this.dialogVisible = !!key
    },
    dialogVisible(visible) {
      if (visible) {
        // Restore fields for current project
        this.form = _.defaultsDeep(this.restoreFields, this.form)
      } else {
        // Reset fields to blank
        this.$refs['projectEditorForm'].resetFields()
        this.$emit('update:projectKey', null)
      }
    },
  },
  methods: {
    updateFirebaseDB(key, payload) {
      // console.log('[ProjectEditor] updateFirebaseDB ', key, payload)
      this.loadingSubmit = true
      this.$firebaseRefs.projects
        .child(key)
        .update(payload)
        .then(() => {
          this.loadingSubmit = false
          this.$message(`${payload.name} 更新成功`)
          this.dialogVisible = false
        })
        .catch(error => {
          this.loadingSubmit = false
          this.$message.error('更新專案失敗：', error.message)
        })
    },
    deleteProject(key, $event) {
      if (!$event.shiftKey) {
        return this.askShiftKey()
      }

      this.$firebaseRefs.projects
        .child(key)
        .set(null)
        .then(() => {
          this.$message(`刪除成功`)
          this.dialogVisible = false
        })
        .catch(error => {
          this.$message.error('刪除專案失敗：', error.message)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const payload = {
            ...this.form,
            // Ignore empty detail fileds aka ""
            detail: _.omitBy(this.form.detail, _.isEmpty),
          }
          this.updateFirebaseDB(this.projectKey, payload)
        } else {
          this.$message.error('格式有誤')
          return false
        }
      })
    },
    makeRegexValidator(regex, errorMessage, required) {
      return (rule, value, callback) => {
        const empty = !value

        if (empty && required) {
          callback('此欄位為必填')
        } else if (empty && !required) {
          callback()
        } else if (!empty && regex.test(value)) {
          callback()
        } else {
          callback(new Error(errorMessage))
        }
      }
    },
    askShiftKey() {
      this.$message.error('請按著 Shift 鍵')
    },
  },
}
</script>

<style lang="scss" scoped>
.float-right {
  float: right;
}

.float-left {
  float: left;
}
</style>
