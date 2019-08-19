<template lang="pug">
    .columns
        .column
            slot(name="left")
        .column
            slot(name="right")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Columns extends Vue {}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .columns
        margin-bottom 10px
        .column
            margin-bottom 10px
            & + .column
                margin-bottom 0

    @media screen and (min-width: desktop_width)
        .columns
            display flex
            justify-content space-between
            .column
                margin-bottom 0
                width calc(50% - 5px)
</style>
