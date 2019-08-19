<template lang="pug">
    .list-control
        .control-item(v-if="!notMove" v-show="hasPrevious" @click="moveUp")
            fa(icon="arrow-left" v-if="leftRight")
            fa(icon="arrow-up" v-else)
        .control-item(v-if="!notMove" v-show="hasNext" @click="moveDown")
            fa(icon="arrow-right" v-if="leftRight")
            fa(icon="arrow-down" v-else)
        .control-item.remove(v-if="!notRemove" @click="remove")
            fa(icon="times")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class ListControl extends Vue {
  @Prop({ type: Array }) value!: Array<any>;
  @Prop({ type: Number }) index!: number;
  @Prop({ type: Boolean }) notMove!: boolean;
  @Prop({ type: Boolean }) notRemove!: boolean;
  @Prop({ type: Boolean }) leftRight!: boolean;

  get list () {
    return this.value
  }
  set list (value: any) {
    this.$emit('input', value)
  }

  get hasPrevious () {
    return this.index > 0
  }
  get hasNext () {
    return this.index < this.list.length - 1
  }

  move (index: number) {
    this.list.splice(index, 0, this.list.splice(this.index, 1)[0])
  }
  moveUp () {
    if (this.hasPrevious) this.move(this.index - 1)
  }
  moveDown () {
    if (this.hasNext) this.move(this.index + 1)
  }
  remove () {
    this.list.splice(this.index, 1)
  }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .list-control
        display flex
        .control-item
            width 28px
            height 28px
            margin-left 5px
            display flex
            align-items center
            justify-content center
            color color_green
            &.remove
                color color_red
</style>
