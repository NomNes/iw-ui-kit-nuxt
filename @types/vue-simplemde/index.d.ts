declare module "vue-simplemde" {
    import {FunctionalComponentOptions} from "vue"
    import {PropsDefinition} from "vue/types/options"
    interface IVueSimplemdeProps {
        value: string
        name: string
        previewClass: string
        autoinit: boolean
        highlight: boolean
        sanitize: boolean
        configs: {[key: string]: any}
    }
    export const VueSimplemde: FunctionalComponentOptions<IVueSimplemdeProps, PropsDefinition<IVueSimplemdeProps>>;
    export default VueSimplemde
}
