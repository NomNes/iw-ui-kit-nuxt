<template lang="pug">
    .form-button(:class="[color, inline ? 'inline' : '', disabled ? 'disabled' : '', loading ? 'loading' : '']" :is="type" :disabled="disabled" :to="to" @click="click($event)")
        slot
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FormButton extends Vue {
  @Prop({ type: String, default: 'white', validator: value => ['white', 'green', 'red', 'blue', 'yellow', 'black'].includes(value) }) color!: string;
  @Prop({ type: Boolean }) inline!: boolean;
  @Prop({ type: String, default: 'button', validator: value => ['button', 'router-link', 'nuxt-link', 'a', 'div'].includes(value) }) type!: string;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: String }) to!: string;

  click (event: any) {
    if (!this.disabled && !this.loading) this.$emit('click', event)
  }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .form-button
        display block
        width 100%
        color inherit
        height 30px
        border 1px solid
        border-radius 5px
        line-height 20px
        padding 4px 10px
        text-align center
        font-size inherit
        margin-bottom 10px
        outline none
        text-decoration none
        &.green
            background color_green
            border-color color_green
            color #fff
        &.red
            background color_red
            border-color color_red
            color #fff
        &.yellow
            background color_yellow
            border-color color_yellow
        &.blue
            background color_blue
            border-color color_blue
            color #fff
        &:last-child
            margin-bottom 0
        &.disabled
        &.loading
            opacity .5
        &.loading
            position relative
            &::before
                content ""
                width 10px
                height 10px
                border-radius 50%
                background main_dark
                position absolute
                top 50%
                left 50%
                margin -5px 0 0 -5px
                animation load 1s infinite

    @keyframes load
        0%
            left 10px
        50%
            left calc(100% - 10px)
        100%
            left 10px
</style>
