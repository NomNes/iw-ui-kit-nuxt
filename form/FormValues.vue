<template lang="pug">
    FormItem.form-values(:label="label" :loading="loading" :invalid="localInvalid")
        .list
            .item.disabled(v-for="value in inherited" :key="value") {{ value }}
            .item(v-for="(value, index) in values" :key="value")
                | {{ value }}
                .remove(@click="removeVariant(index)")
                    fa(icon="times")
        input(v-model="input" @keydown.enter="addVariant" placeholder="Добавить вариант")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component<FormValues>({
  components: {
    FormItem
  },
  mounted () {
    this.$emit('validation', this.valid)
  },
  beforeDestroy () {
    this.$emit('validation', true)
  }
})
export default class FormValues extends Vue {
  @Prop({ type: Array }) value!: Array<string | number>;
  @Prop({ type: Array, default: () => [] }) inherited!: Array<string | number>;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: Boolean }) required!: boolean;
  @Prop({ type: Boolean }) loading!: boolean;

  get values () {
    return this.value
  }
  set values (value: Array<string | number>) {
    this.$emit('input', value)
  }

  get valid () {
    return !(this.required && !this.value.length && !this.inherited.length)
  }

  removeVariant (index: number) {
    if (this.values[index]) this.values.splice(index, 1)
  }
  addVariant () {
    this.input = this.input.trim()
    if (this.input && !this.values.includes(this.input) && !this.inherited.includes(this.input)) {
      this.values.push(this.input)
    }
    this.input = ''
  }
  validate () {
    if (this.valid) {
      this.localInvalid = false
    } else {
      this.localInvalid = 'Обязательно для заполнения'
    }
  }
  change (event?: any) {
    this.validate()
    this.$emit('change', event)
  }

  localInvalid: boolean | string = false;
  input: string = '';

  @Watch('valid')
  onValidChange () {
    this.$emit('validation', this.valid)
  }
  @Watch('values')
  onValuesChange () {
    this.change()
  }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .form-values
        .form-element
            background none
            display block
        .list
            display flex
            flex-wrap wrap
            .item
                background main_dark
                color #fff
                border-radius 3px
                display flex
                height 20px
                line-height 20px
                font-size 13px
                padding-left 5px
                margin 0 5px 5px 0
                &.disabled
                    cursor not-allowed
                    opacity .7
                    padding-right 5px
                .remove
                    width 20px
                    height 20px
                    display flex
                    justify-content center
                    align-items center
</style>
