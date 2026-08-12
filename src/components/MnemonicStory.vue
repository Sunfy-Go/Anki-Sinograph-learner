<template>
    <div class="mnemonic-story">
        <div class="mnemonic-story__title" @click="isOpenContent = !isOpenContent">
            <span class="mnemonic-story__title-icon" :class="{ 'is-active': isOpenContent }">›</span>
            <div class="mnemonic-story__title-content">{{ title }}</div>
        </div>
        <div class="mnemonic-story__content" v-show="isOpenContent">{{ content }}</div>
    </div>
</template>

<style lang="scss" scoped>
.mnemonic-story {
    width: 100%;
    text-align: left;

    &__title {
        padding: 7px 10px;
        background-color: #bee0c3;
        cursor: pointer;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    &__title-icon {
        font-size: 15px;
        margin-right: 5px;
        font-weight: 400;
        display: inline-block;
        transition: transform 0.2s ease;
        &.is-active {
            transform: rotate(90deg);
        }
    }
    &__title-content {
        font-size: 18px;
        font-family: 'Times New Roman', Times, serif;
    }

    &__content {
        padding: 10px;
        background-color: rgb(217, 237, 237);
    }
}
</style>

<script setup lang="ts">
import { getDataElement } from '@/utils/utils';
import { onMounted, ref } from 'vue';

const title = ref(""); 
const content = ref("");
const isOpenContent = ref(false); 

onMounted(()=> {
    title.value = getDataElement('mnemonic-stoty-title');
    content.value = getDataElement('mnemonic-stoty-content');
});
</script>