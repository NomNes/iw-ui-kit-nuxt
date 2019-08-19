<template lang="pug">
    FormItem.autocomplete
        input(v-model="inputValue" @keydown.enter="addItem" @focus="showList" @blur="hideList")
        .autocomplete-list(v-if="items.length" v-show="show")
            .line(v-for="item in items" :key="item.value" @click="selectItem(item)") {{ item.title }}
        .autocomplete-list(v-else-if="inputValue && !loading" v-show="show")
            .line(@click="addItem") Создать и добавить "{{ inputValue }}"
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from '../form/FormItem.vue'

interface IGetHandler {
    (value: string): Promise<Array<IItem>>
}
interface IAddHandler {
    (title: string): Promise<IItem>
}
interface IItem {
    value: string,
    title: string
}

@Component({
  components: {
    FormItem
  }
})
export default class Autocomplete extends Vue {
  @Prop({ type: Function, required: true }) getHandler!: IGetHandler;
  @Prop({ type: Function, required: true }) addHandler!: IAddHandler;
  @Prop({ type: Boolean }) adding!: boolean;

  inputValue = '';
  items: Array<IItem> = [];
  loading = false;
  show = false;
  lastValue = '';

  selectItem (item: IItem) {
    this.$emit('select', item)
    this.inputValue = ''
  }
  getAutocomplete (value: string) {
    this.loading = true
    return setTimeout(async () => {
      if (value === this.inputValue) {
        const items = await this.getHandler(value)
        if (value === this.inputValue) {
          this.items = items
          this.loading = false
          this.lastValue = value
        }
      }
    }, 200)
  }
  async addItem () {
    const title = this.inputValue
    this.inputValue = ''
    for (let item of this.items) {
      if (item.title.toLowerCase() === title.toLowerCase()) {
        return this.selectItem(item)
      }
    }
    const item = await this.addHandler(title)
    if (item) this.selectItem(item)
  }
  showList () {
    this.show = true
  }
  hideList () {
    return setTimeout(() => {
      this.show = false
    }, 100)
  }

  @Watch('inputValue')
  onInputValueChange (value: string, oldValue: string) {
    if (value !== oldValue) {
      this.getAutocomplete(value)
    }
  }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .autocomplete
        .form-element
            position relative
        .autocomplete-list
            display block
            position absolute
            top 35px
            left 0
            width 100%
            background #fff
            border-radius 5px
            box-shadow 0 0 5px rgba(0, 0, 0, .2)
            max-height 120px
            overflow auto
            .line
                padding 0 10px
                line-height 20px
                max-width 100%
                overflow hidden
                text-overflow ellipsis

    @media screen and (min-width: desktop_width)
        .autocomplete
            .autocomplete-list
                .line
                    cursor pointer
                    &:hover
                        background main_light_text
                        color #fff
</style>
