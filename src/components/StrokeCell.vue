<template>
    <div class="stroke-cell" @click="emits('select')">
        <canvas ref="canvasRef" class="stroke-cell__canvas"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { useSketch } from '@/composables/useSketch';
import { onMounted, onUnmounted, ref } from 'vue';

const { initializeCell, undo, redo, clear } = useSketch();
const canvasRef = ref<HTMLCanvasElement | null>(null);
let cleanup: (()=> void) | undefined;

const emits = defineEmits<{ select: [] }>();
defineExpose({ undo, redo, clear });

onMounted(()=> {
    if (!canvasRef.value) return;
    cleanup = initializeCell(canvasRef.value);
});
 
onUnmounted(()=> {
    if(cleanup) cleanup();
});
</script>

<style lang="scss" scoped>
.stroke-cell {
    position: relative;
    flex: 1; /* Tự động chia đều chiều rộng theo số ô */
    aspect-ratio: 1 / 1; /* BẮT BUỘC: Đảm bảo ô luôn là HÌNH VUÔNG */

    max-width: 400px;
    max-height: 70vh;

    background-color: #ffffff;
    border: 2px solid #9d9d9d;
    border-radius: 2px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);

    background-image: 
        linear-gradient(to right, transparent calc(50% - 1px), #d1c7b7 calc(50% - 1px), #d1c7b7 calc(50% + 1px), transparent calc(50% + 1px)),
        linear-gradient(to bottom, transparent calc(50% - 1px), #d1c7b7 calc(50% - 1px), #d1c7b7 calc(50% + 1px), transparent calc(50% + 1px)),
    
        linear-gradient(45deg, transparent calc(50% - 0.8px), #e8e0d5 calc(50% - 0.8px), #e8e0d5 calc(50% + 0.8px), transparent calc(50% + 0.8px)),
        linear-gradient(-45deg, transparent calc(50% - 0.8px), #e8e0d5 calc(50% - 0.8px), #e8e0d5 calc(50% + 0.8px), transparent calc(50% + 0.8px));

    &:hover {
        border: 2px solid #070707;
    }

    &__canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }
}
</style>