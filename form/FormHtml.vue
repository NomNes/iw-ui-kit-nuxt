<template lang="pug">
    FormItem.form-html-editor(:label="label" :invalid="localInvalid" :disabled="disabled")
        Editor(
            v-model="content"
            :disabled="disabled"
            :api-key="apiKey"
            :toolbar="toolbar"
            :init="init"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import Editor from '@tinymce/tinymce-vue'
import FormItem from './FormItem.vue'

@Component<FormHtml>({
  components: {
    Editor,
    FormItem
  },
  mounted () {
    this.$emit('validation', this.valid)
  },
  beforeDestroy () {
    this.$emit('validation', true)
  }
})
export default class FormHtml extends Vue {
  @Prop({ type: String }) value!: string;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: String }) label!: string;
  @Prop({ type: Boolean }) required!: boolean;

  @Prop({ type: String, default: 'gi3ok4b5itik1f40ti27tgyp75rehdu6i5fd1hoe3p8tm1sb' }) apiKey!: string;
  @Prop({ type: Array,
    default: () => [
      'styleselect | bold italic | bullist numlist | blockquote | alignleft aligncenter alignright | link anchor image | code'
    ] }) toolbar!: string[];
  @Prop({ type: Array,
    default: () => [
      'lists link image anchor code',
      'searchreplace wordcount'
    ] }) plugins!: string[];

  get content () {
    return this.value
  }
  set content (value: string) {
    this.$emit('input', value)
  }

  get init () {
    const init: {[key: string]: any} = {
      language: 'ru',
      language_url: 'https://cdn.jsdelivr.net/npm/tinymce-lang/langs/ru.js',
      plugins: this.plugins
    }
    if (this.toolbar.length) {
      if (this.toolbar.length > 1) {
        for (let i = 0; i < this.toolbar.length; i++) {
          init[`toolbar${i + 1}`] = this.toolbar[i]
        }
      } else {
        init.toolbar = this.toolbar[0]
      }
    }
    return init
  }

  get valid () {
    return !(this.required && !this.value)
  }

  localInvalid: boolean | string = false;

  validate () {
    if (this.valid) {
      this.localInvalid = false
    } else {
      this.localInvalid = 'Обязательно для заполнения'
    }
  }

  change (event: any) {
    this.validate()
    this.$emit('change', event)
  }

  @Watch('valid')
  onValidChange () {
    this.$emit('validation', this.valid)
  }
}
</script>

<style lang="stylus">
    .form-html-editor
        .form-element
            display block
            border 0
</style>
