<template lang="pug">
    .form-item(:class="{disabled, loading, invalid}" @click="$emit('click', $event)")
        label.label(v-if="label") {{ label }}
        .form-element
            .icon(v-if="disabled")
                fa(icon="lock")
            .icon(v-else-if="icon")
                fa(v-if="!icon.prefix || icon.prefix === 'fas'" :icon="icon.name ? icon.name : icon")
            slot
            .invalid(v-if="invalid") {{ invalid }}
        .info(v-if="info") {{ info }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FormItem extends Vue {
  @Prop({ type: String }) label!: string;
  @Prop({ type: [String, Object] }) icon!: string | {name: string, prefix: string};
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: [String, Boolean], default: false }) invalid!: boolean;
  @Prop({ type: String }) info!: string;
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .form-item
        margin-bottom 10px
        &:last-child
            margin-bottom 0
        & > .label
            font-weight bold
            margin-bottom 5px
            display block
            padding 0 5px
        & > .form-element
            position relative
            border 1px solid #ccc
            border-radius 5px
            display flex
            background #fff
            input
            select
                height 30px
            input
            textarea
            select
                line-height 20px
                padding 5px 10px
                display block
                width 100%
                border-radius 5px
                color inherit
                font-size inherit
                outline none
            .icon
                width 30px
                min-width 30px
                height 30px
                display flex
                align-items center
                justify-content center
                font-size inherit
                border-top-left-radius 5px
                border-bottom-left-radius 5px

        &.disabled
        &.loading
            opacity .7
        &.loading
            .form-element
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
        &.invalid
            & > .form-element
                border-color color_red
                position relative
                .invalid
                    position absolute
                    top calc(100% + 10px)
                    background color_red
                    color #fff
                    width 100%
                    border-radius 5px
                    padding 5px 10px
                    text-align center
                    z-index 1
                    &::before
                        content ""
                        border-top 0
                        border-left 8px solid transparent
                        border-right 8px solid transparent
                        border-bottom 8px solid color_red
                        position absolute
                        top -8px
                        left 50%
                        margin-left -8px
                input
                textarea
                    &:focus
                        & + .invalid
                            display none
        .info
            font-style italic
            color main_light_text
            padding 2px 5px
            font-size .8em
            word-break break-all

    @keyframes load
        0%
            left 10px
        50%
            left calc(100% - 10px)
        100%
            left 10px
</style>
