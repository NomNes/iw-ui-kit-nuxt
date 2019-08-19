<template lang="pug">
    FormUpload.form-image(
        @loading="$emit('loading', $event)"
        @change="$emit('change', $event)"
        v-model="innerValue"
        :label="label"
        :multiple="multiple"
        :action="action"
        :pathTemplate="pathTemplate"
    )
        .image-preview(slot-scope="item" :style="{backgroundImage: item ? `url(${pathTemplate.replace('[name]', item.filename)})` : null, backgroundSize: contain ? 'contain' : 'cover'}")
        .image-preview.empty(slot="empty")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormUpload from './FormUpload.vue'

@Component<FormImage>({
  components: {
    FormUpload
  }
})
export default class FormImage extends Vue {
  @Prop({ type: [String, Array] }) value!: string | Array<string>;
  @Prop({ type: String }) label!: string;
  @Prop({ type: Boolean }) contain!: boolean;
  @Prop({ type: Boolean }) multiple!: boolean;
  @Prop({ type: String, default: '[name]' }) pathTemplate!: string;
  @Prop({ type: String, required: true }) action!: string;

  get innerValue () {
    return this.value
  }
  set innerValue (value: string | Array<string>) {
    this.$emit('input', value)
  }
}
</script>

<style lang="stylus">
  @require "../assets/VAR.styl"

  .form-image
    .preview
      width 150px
      height 100px
      .image-preview
        width 150px
        height 100px
        border-radius 5px
        background-color #ccc
        background-position center
        background-repeat no-repeat
        display flex
        justify-content center
        align-items center
        font-size 25px
      &.empty
        height 100px
        .image-preview
          background-image url('../assets/photo-camera.svg')
          background-size 50px
    &.multiple
      .form-element
        display flex
        flex-wrap wrap
        align-items center
      .preview
        margin-right 10px
        margin-bottom 10px
        max-width 150px
        min-width 150px
      .select
        width 40px
        height 40px
        font-size 20px
        border 1px solid #ccc
        color #ccc
        background none
        .label
          display none
      .preview.empty
        & + .select
          background none
          .label
            display none
</style>
