<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter();
const goto = (name: string) => router.push({ name });
</script>

<template lang="pug">
ul
    li: button(@click="goto('single')") 个人足迹统计
    li: button 群体足迹统计
    li: button 注册登录
    li: button 踩一下
</template>

<style lang="scss" scoped>
ul {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    list-style: none;
    width: 300px;
    padding: 0;

    li {
        margin: 10px 0;

        button {
            width: 100%;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            margin: 15px;
            padding: 0 20px;
            margin-right: 0;
            border-radius: 4px;
            border: none;
            background: #0075ff;
            color: #fff;
            box-shadow: 0 0 6px #0008;
            transition: all 0.2s ease-in-out;

            &:hover {
                background: #0066e6;
                box-shadow: 0 0 16px #0008;
                transition: all 0.2s ease-in-out;
            }
        }
    }
}
</style>
