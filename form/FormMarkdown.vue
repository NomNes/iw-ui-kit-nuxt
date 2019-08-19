<template lang="pug">
    FormItem.form-markdown(:label="label")
        markdownEditor(v-model="localValue" :configs="editorConfigs")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import markdownEditor from 'vue-simplemde'
import FormItem from './FormItem.vue'

@Component<FormMarkdown>({
  components: {
    markdownEditor,
    FormItem
  }
})
export default class FormMarkdown extends Vue {
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) value!: string;

  get localValue () {
    return this.value
  }
  set localValue (value: string) {
    this.$emit('input', value)
  }

  editorConfigs = {
    toolbar: [
      'heading-2', 'heading-3', 'bold', 'italic',
      '|',
      'unordered-list', 'ordered-list',
      '|', 'link', 'quote', 'clean-block',
      '|',
      'preview', 'fullscreen', 'side-by-side',
      '|',
      'guide'
    ]
  }
}
</script>

<style lang="stylus">
    @import "simplemde/dist/simplemde.min.css"

    .form-markdown
        z-index 10
        position relative
        .form-element
            display block
            border 0
</style>
