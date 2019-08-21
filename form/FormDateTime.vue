<template lang="pug">
    FormItem.form-datetime(:label="label" :loading="loading" :invalid="localInvalid" :info="info" :disabled="disabled" icon="calendar-alt" @click="openCalendar")
        .datetime-label {{ formattedDateTime }}
        .datetime-picker(@click.stop="() => false" v-if="pickerOpen")
            FormSelect.month(v-model="pickerDateMonth" :items="monthList")
            FormNumber.year(v-model="pickerDateYear" :min="minDateYear" :max="maxDateYear")
            .datetime-days
                .week-days
                    .day Пн
                    .day Вт
                    .day Ср
                    .day Чт
                    .day Пт
                    .day Сб
                    .day Вс
                .days
                    .day(v-for="(day, index) in daysList" :key="index"
                        :class="{empty: !day, current: day === pickerDateDate, disabled: day > maxDateDate || day < minDateDate}"
                        @click="setPickerDate(day)")
                        | {{ day ? day : "" }}
            .buttons
                FormButton(color="green" type="div" @click="applyDate") Применить
                FormButton(color="red" type="div" @click="close") Отмена
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from './FormItem.vue'
import FormSelect from './FormSelect.vue'
import FormNumber from './FormNumber.vue'
import FormButton from './FormButton.vue'
import fecha from 'fecha'

@Component<FormDateTime>({
  components: {
    FormItem,
    FormSelect,
    FormNumber,
    FormButton
  },
  mounted () {
    this.$emit('validation', this.valid)
  },
  beforeDestroy () {
    this.$emit('validation', true)
  }
})
export default class FormDateTime extends Vue {
  @Prop({ type: Date }) value!: Date;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: String }) info!: string;
  @Prop({ type: Boolean }) required!: boolean;
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: String, default: 'D.MM.YYYY' }) format!: string;
  @Prop({ type: Date }) min!: Date;
  @Prop({ type: Date }) max!: Date;

  get localValue () {
    return this.value
  }
  set localValue (value: Date | undefined) {
    this.$emit('input', value)
  }

  get valid () {
    return !(this.required && !this.value)
  }

  get formattedDateTime () {
    return this.localValue ? fecha.format(this.localValue, this.format) : 'Не указано'
  }

  localInvalid: boolean | string = false;

  validate () {
    if (this.valid) {
      this.localInvalid = false
    } else {
      this.localInvalid = 'Обязательно для заполнения'
    }
  }
  change (event: any) {
    this.validate()
    this.$emit('change', event)
  }

  @Watch('valid')
  onValidChange () {
    this.$emit('validation', this.valid)
  }

  /** datetime-picker fields **/
  pickerOpen = false;
  pickerDate = new Date();
  get pickerDateMonth () {
    return this.pickerDate.getMonth()
  }
  set pickerDateMonth (month: number) {
    this.pickerDate.setMonth(month)
    if (this.pickerDate.getMonth() === month) {
      this.pickerDate = new Date(this.pickerDate)
    } else {
      this.pickerDate = new Date(this.pickerDateYear, month + 1, 0)
    }
    if (this.maxDateDate && this.pickerDateDate >= this.maxDateDate) this.pickerDateDate = this.maxDateDate
    if (this.minDateDate && this.pickerDateDate <= this.minDateDate) this.pickerDateDate = this.minDateDate
  }

  get pickerDateYear () {
    return this.pickerDate.getFullYear()
  }
  set pickerDateYear (year: number) {
    this.pickerDate.setFullYear(year)
    this.pickerDate = new Date(this.pickerDate)
    if (this.maxDateDate && this.pickerDateDate >= this.maxDateDate) this.pickerDateDate = this.maxDateDate
    if (this.minDateDate && this.pickerDateDate <= this.minDateDate) this.pickerDateDate = this.minDateDate
  }

  get pickerDateDate () {
    return this.pickerDate.getDate()
  }
  set pickerDateDate (date: number) {
    this.pickerDate.setDate(date)
    this.pickerDate = new Date(this.pickerDate)
  }

  get minDateYear () {
    return this.min ? this.min.getFullYear() : undefined
  }
  get maxDateYear () {
    return this.max ? this.max.getFullYear() : undefined
  }
  get maxDateMonth () {
    return this.max ? this.max.getMonth() : undefined
  }
  get minDateMonth () {
    return this.min ? this.min.getMonth() : undefined
  }
  get maxDateDate () {
    if (this.maxDateMonth && this.maxDateYear && this.pickerDateYear >= this.maxDateYear && this.pickerDateMonth >= this.maxDateMonth) {
      return this.max.getDate()
    }
    return 31
  }
  get minDateDate () {
    if (this.minDateMonth && this.minDateYear && this.pickerDateYear <= this.minDateYear && this.pickerDateMonth <= this.minDateMonth) {
      return this.min.getDate()
    }
    return 1
  }

  get monthList () {
    let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    if (this.minDateYear && this.pickerDateYear <= this.minDateYear) {
      const minMonth = this.min.getMonth()
      months.splice(0, minMonth)
    }
    if (this.maxDateYear && this.pickerDateYear >= this.maxDateYear) {
      const maxMonth = this.max.getMonth()
      months.splice(maxMonth + 1)
    }
    return months.map((m, i) => ({ value: i, title: m }))
  }

  get daysList () {
    const days = []
    let firstDay = new Date(this.pickerDateYear, this.pickerDateMonth, 1).getDay()
    if (!firstDay) firstDay = 7
    if (firstDay > 1) {
      for (let i = 1; i < firstDay; i++) {
        days.push(0)
      }
    }
    const lastDate = new Date(this.pickerDateYear, this.pickerDateMonth + 1, 0).getDate()
    for (let i = 1; i <= lastDate; i++) {
      days.push(i)
    }
    return days
  }

  setPickerDate (day: number) {
    if (day && day <= this.maxDateDate && day >= this.minDateDate) this.pickerDateDate = day
  }

  openCalendar () {
    this.pickerDate = this.localValue ? new Date(this.localValue) : new Date()
    this.pickerOpen = true
  }
  close () {
    this.pickerOpen = false
  }
  applyDate () {
    this.localValue = new Date(this.pickerDate)
    this.close()
  }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .form-datetime
        .datetime-label
            height 30px
            line-height 30px
        .buttons
            width 100%
            display flex
            justify-content space-between
            .form-button
                width calc(50% - 5px)
        .datetime-picker
            position absolute
            top 34px
            left 0
            width 100%
            background #fff
            box-shadow 0 0 5px rgba(0, 0, 0, .2)
            border-radius 5px
            padding 5px
            display flex
            flex-wrap wrap
            justify-content center
            z-index 5
            .year
                width 80px
            .month
                width calc(100% - 90px)
                margin-right 10px
            .datetime-days
                width 220px
                margin-bottom 10px
                .day
                    width 30px
                    height 30px
                    display flex
                    justify-content center
                    align-items center
                    border-radius 3px
                    &:nth-child(7n)
                    &:nth-child(7n - 1)
                        color color_red
                    &.current
                        background main_dark
                        color #fff
                    &.disabled
                        opacity .5
                .week-days
                    display flex
                    font-weight bold
                .days
                    display flex
                    flex-wrap wrap
</style>
