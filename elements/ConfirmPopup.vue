<template lang="pug">
    Popup(@close="$emit('close')")
        .confirm-popup
            .title {{ title }}
            .buttons
                FormButton(@click="confirmAction" type="div" :color="confirmColor") {{ confirmText }}
                FormButton(@click="cancelAction" type="div" :color="cancelColor") {{ cancelText }}
            audio(v-if="sound === 'alert'" :src="require('../assets/alert.mp3')" autoplay)
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Popup from 'vue-light-popup'
import FormButton from '../form/FormButton.vue'

@Component<ConfirmPopup>({
  components: {
    Popup,
    FormButton
  }
})
export default class ConfirmPopup extends Vue {
    @Prop({ type: String, default: 'Вы уверены?' }) title!: string;
    @Prop({ type: String, default: 'Да' }) confirmText!: string;
    @Prop({ type: String, default: 'red', validator: value => ['white', 'green', 'red', 'blue', 'yellow', 'black'].includes(value) }) confirmColor!: string;
    @Prop({ type: String, default: 'Нет' }) cancelText!: string;
    @Prop({ type: String, default: 'green', validator: value => ['white', 'green', 'red', 'blue', 'yellow', 'black'].includes(value) }) cancelColor!: string;
    @Prop({ type: String, default: 'alert' }) sound!: string;

    confirmAction () {
      this.$emit('confirm')
    }
    cancelAction () {
      this.$emit('cancel')
    }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .confirm-popup
        background main_dark
        width 300px
        max-width 100%
        padding 20px
        border-radius 10px
        margin auto
        .title
            text-transform uppercase
            color #fff
        .buttons
            display flex
            justify-content space-between
            margin-top 20px
            .form-button
                width calc(50% - 10px)
</style>
