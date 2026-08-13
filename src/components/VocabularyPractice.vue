<template>
    <div class="vocabulary-practice">
        <div class="vocabulary-practice__stroke-checker">
            <button class="vocabulary-practice__stroke-checker--btn" v-on:click="handleStrokeChecker(true)">
                <PenLine class="stroke-checker-icon"/>
                <span class="stroke-checker-content">笔画检查</span>
            </button>
            <StrokeChecker v-if="isShowStrokeChecker" @back="handleStrokeChecker(false)"/>
        </div>

        <div class="vocabulary-practice__shadowing"></div>
        <div class="vocabulary-practice__mean"></div>
    </div>
</template>

<style lang="scss" scoped>
.vocabulary-practice {
    width: 100%;
    background-color: antiquewhite;

    &__stroke-checker {
        height: 50px;
        background-color: cadetblue;
    }
    &__stroke-checker--btn {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 7px;
    }
}

.stroke-checker-icon {
    width: 18px;
    height: 18px;
    color: #5e5e5e;
}

.stroke-checker-content {
    font-size: 15px;
    color: #5e5e5e;
}

</style>


<script setup lang="ts">
import { PenLine } from 'lucide-vue-next';
import StrokeChecker from './StrokeChecker.vue';
import { ref } from 'vue';

const isShowStrokeChecker = ref(false);

const handleStrokeChecker = (isShow: boolean)=> isShowStrokeChecker.value = isShow;

</script>