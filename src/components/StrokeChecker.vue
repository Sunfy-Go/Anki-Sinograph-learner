<template>
    <teleport to="body">
        <div class="stroke-checker">
            
            <div class="stroke-checker__learn">
                <div class="stroke-checker__grid" :data-count="charList.length">
                    <StrokeCell v-for="(char, i) in charList" 
                        :key="`${char}_${i}`"  
                        :ref="(el)=> { if(el) cellRefs[i] = el as InstanceType<typeof StrokeCell> }"
                        @select="handleSelectCell(i)" 
                    />
                </div>
                <div class="stroke-checker__tool-wrapper">
                    <div class="stroke-checker__tool" v-show="isShowTools" @click.stop>
                        <button class="botton-tool stroke-checker__tool-undo" @click="handleUndo">undo</button>
                        <button class="botton-tool stroke-checker__tool-redo" @click="handleRedo">redo</button>
                        <button class="botton-tool stroke-checker__tool-clear" @click="handleClear">clear</button>
                    </div>
                </div>
            </div>

            <div class="stroke-checker__controller">
                <button class="stroke-checker__btn-back" @click="emits('back')">返回</button>
                <button class="stroke-checker__btn-check">检查</button>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import StrokeCell from './StrokeCell.vue';

const props = withDefaults(defineProps<{ word?: string; }>(), { word: '电脑脑' });
const charList = computed(() => { return props.word.split('') });
const cellRefs = ref<InstanceType<typeof StrokeCell>[]>([]);
const activeIndex = ref<number>(0);

const isShowTools = ref<Boolean>(false);

const handleUndo = ()=> cellRefs.value[activeIndex.value]?.undo();
const handleRedo = ()=> cellRefs.value[activeIndex.value]?.redo();
const handleClear = ()=> cellRefs.value[activeIndex.value]?.clear();

const handleSelectCell = (index: number)=> {
    activeIndex.value = index;
    isShowTools.value = true;
}

const handleClickOutside = (event: MouseEvent)=> {
    const target = event.target as HTMLElement;
    if (!target.closest('.stroke-checker__grid')) {
        isShowTools.value = false;
    }
}

onMounted(()=> {
    window.addEventListener('click', handleClickOutside);
})

onUnmounted(()=> {
    window.removeEventListener('click', handleClickOutside);
})

const emits = defineEmits<{ back: [] }>();
</script>

<style lang="scss" scoped>
.stroke-checker {
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    z-index: 9999;
    background-color: #ffffff;
    box-shadow: 0 0 0 9999px rgba(38, 37, 37, 0.682);
    border-radius: 5px;
    
    display: flex;
    flex-direction: column;

    &__learn {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        overflow: hidden;
        padding: 16px;
        box-sizing: border-box;
    }

    &__grid {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 16px; 
        width: 100%;
        min-height: 0; // Tránh lỗi flex child bị tràn khung
        margin-bottom: 20px;
    }

    &__tool-wrapper {
        height: 40px; // Chiều cao cố định giữ chỗ
        width: 100%;
    }

    &__tool {
        display: flex;
        gap: 10px;
    }

    // ---------------------------------------
    &__grid[data-count="1"] {
        .stroke-checker__box {
            max-width: 500px; 
        }
    }

    &__grid[data-count="4"] {
        gap: 8px; 
        
        .stroke-checker__box {
            max-width: 250px; 
        }
    }
    //---------------------

    &__controller {
        width: 100%;
        height: 48px;
        flex-shrink: 0;
        display: flex;
        border-radius: 0px 0px 4px 4px;
        overflow: hidden;
        margin-top: 16px;
    }

    &__btn-back, 
    &__btn-check {
        flex: 1;
        height: 100%;
        border: none;
        cursor: pointer;
        font-size: 15px;
        font-weight: bold;
    }

    &__btn-back { 
        color: #c6e1ea;
        background-color: #6c8891; 
    } 
    &__btn-check { 
        color: #e6eac6;
        background-color: #809944; 
    }
}

.botton-tool {
    padding: 5px 10px;
}
</style>