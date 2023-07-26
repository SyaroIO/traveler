<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
    ccode: { type: Number, require: true },
    code: { type: Number, require: true },
    name: { type: String, require: true },
    select: { type: Number, default: 0 },
});

const select = ref(props.select);
watch(props, (_, props) => select.value = props.select);
const options = [
    { name: '清除', value: 0 },
    { name: '想去', value: 1 },
    { name: '路过', value: 2 },
    { name: '去过', value: 3 },
    { name: '住过', value: 4 },
    { name: '家乡', value: 5 },
];

</script>

<template lang="pug">
.menu
    span {{ props.name }}
    ul
        li(v-for='{ name, value } of options' :key='value')
            input(:id='`menu-${value}`' type='radio' :value='value' v-model='select' @change='$emit("select", [props.ccode, props.code, value])')
            label(:for='`menu-${value}`') {{ name }}

</template>

<style lang="scss" scoped>
div.menu {
    display: block;
    width: 110px;
    background: #ffffff44;
    backdrop-filter: blur(2px);
    font-size: 14px;
    border-radius: 8px 8px 0 0;

    >span {
        display: block;
        width: 100%;
        height: 30px;
        font-size: 1.4em;
        line-height: 30px;
        background: #ca8dff88;
        font-weight: bold;
        text-align: center;
        border-radius: 8px 8px 0 0;
    }

    >ul {
        display: block;
        width: 100%;

        >li {
            display: block;
            width: 100%;

            >label {
                display: block;
                width: 100%;
                height: 25px;
                line-height: 25px;
                text-align: center;
                cursor: pointer;

                &:hover {
                    background: #ffff8888;
                }
            }

            >input {
                display: none;

                &:checked+label {
                    background: #88ff8888;
                }
            }
        }
    }
}
</style>
