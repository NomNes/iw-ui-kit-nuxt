<template lang="pug">
    FormItem.checkbox(:disabled="disabled")
        input(type="checkbox" :value="val" v-model="localValue" :required="required" :id="id" @change="$emit('change', $event)")
        label(:for="id")
            .check-element
                .checked
                    fa(icon="check")
            .label(v-if="label") {{ label }}

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component<FormCheckbox>({
  components: {
    FormItem
  }
})
export default class FormCheckbox extends Vue {
    @Prop({ type: [Boolean, Array] }) value!: boolean | Array<string>;
    @Prop({ type: Boolean }) required!: boolean;
    @Prop({ type: [String, Number, Boolean] }) val!: string | number | boolean;
    @Prop({ type: String }) label!: string;
    @Prop({ type: Boolean }) disabled!: boolean;

    get localValue () {
      return this.value
    }
    set localValue (value: boolean | Array<string>) {
      this.$emit('input', value)
    }

    id: string = `form-item-checkbox-${Math.round(Math.random() * 1000)}${Math.round(Math.random() * 1000)}`;
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .form-item.checkbox
        .form-element
            border 0
            background none
            label
                position relative
                line-height 20px
                padding 5px 5px 5px 7px
                display flex
                justify-content flex-start
                align-items center
                min-height 30px
                .check-element
                    width 16px
                    height 16px
                    margin-right 7px
                    background #fff
                    border 1px solid rgba(0, 0, 0, .1)
                    &:last-child
                        margin-right 2px
                    .checked
                        display none
            input
                display none
                &:checked
                    & + label
                        .check-element
                            .checked
                                display block
                                line-height 14px
                                font-size 14px
                                text-align center

    @media screen and (min-width: desktop_width)
        .form-item.checkbox
            cursor pointer
</style>
