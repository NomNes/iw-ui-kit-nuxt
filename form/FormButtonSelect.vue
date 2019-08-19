<template lang="pug">
    FormButton(@click.stop="toggle").form-button-select
        slot
        .items(v-if="open")
            .item(v-for="item in items" @click.stop="select(item.id)") {{ item.title }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormButton from './FormButton.vue'

@Component<FormButtonSelect>({
  components: {
    FormButton
  },
  mounted () {
    if (process.browser) {
      document.addEventListener('touchend', this.close)
      document.addEventListener('click', this.close)
    }
  },
  beforeDestroy () {
    if (process.browser) {
      document.removeEventListener('touchend', this.close)
      document.removeEventListener('click', this.close)
    }
  }
})
export default class FormButtonSelect extends Vue {
  @Prop({ type: Array, default: () => [] }) items!: Array<{id: string | number, item: string}>;
  open: boolean = false;
  select (id: string | number) {
    this.$emit('select', id)
    this.close()
  }
  close () {
    this.open = false
  }
  toggle () {
    this.open = !this.open
  }
}
</script>

<style lang="stylus">
    .form-button-select
        position relative
        .items
            position absolute
            top calc(100% + 5px)
            left 0
            width 100%
            background #fff
            border-radius 3px
            box-shadow 0 1px 5px rgba(0, 0, 0, .2)
</style>
