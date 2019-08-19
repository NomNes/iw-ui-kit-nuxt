<template lang="pug">
    .page-navigation(v-if="pages > 1")
        .page.select.prev(v-if="page > 1" @click="setPage(page - 1)") <<<
        .page.select.next(v-if="page < pages" @click="setPage(page + 1)") >>>
        .label Страница {{ page }}
        .item(v-for="(item, index) of pageList" :key="index")
            .page.current(v-if="item === page") {{ item }}
            .separator(v-else-if="item === '...'") ...
            .page(v-else @click="setPage(item)") {{ item }}
</template>

<script lang="ts">
    import {Component, Vue, Prop} from "vue-property-decorator";

    @Component
    export default class PageNavigation extends Vue {
        @Prop({type: Number, default: 1}) page!: number;
        @Prop({type: Number, default: 1}) pages!: number;
        @Prop({type: Number, default: 9}) displayItems!: number;

        get pageList() {
            const list = [];

            let itemsAround = Math.ceil((this.displayItems - 1) / 2);

            let min = this.page - itemsAround;
            let max = this.page + itemsAround;

            if (min < 1) {
                max -= min - 1;
                min = 1;
            }
            if (max > this.pages) {
                min -= max - this.pages;
                max = this.pages
            }
            if (min < 1) min = 1;

            for (let p = min; p <= max; p++) {
                list.push(p)
            }

            if (list[0] > 1) {
                list[0] = 1;
                list[1] = "...";
            }

            if (list[list.length - 1] < this.pages) {
                list[list.length - 1] = this.pages;
                list[list.length - 2] = "...";
            }

            return list
        }

        setPage(pageNumber: number) {
            this.$router.push({query: {page: pageNumber > 1 ? `${pageNumber}` : undefined}})
        }
    }
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .page-navigation
        display flex
        justify-content center
        position relative
        line-height 30px
        margin-top 10px
        .item
            display none
        .page
            background #fff
            border-radius 3px
            box-shadow 0 0 3px rgba(0, 0, 0, .2)
            &.select
                position absolute
                top 0
                height 100%
                padding 0 10px
                &.prev
                    left 0
                &.next
                    right 0


    @media screen and (min-width: desktop_width)
        .page-navigation
            .label
                display none
            .select
                cursor pointer
            .item
                display block
                margin-right 5px
                cursor pointer
                &:last-child
                    margin-right 0
                .current
                    font-weight bold
                .separator
                    padding 0 3px
            .page
                padding 0 5px
                min-width 30px
                text-align center
</style>
