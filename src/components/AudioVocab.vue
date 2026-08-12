<template>
    <div class="audio-vocab">
        <div class="audio-vocab__controler">
            <IconSpeak class="audio-vocab__controler--icon"/>
            <button class="audio-vocab__controler--play-pause" @click="isPlayPause">
                <component :is="statePlayPause" class="audio-vocab__icon-play-pause"/>
            </button>
        </div>
        <div class="audio-vocab__waveform">
            <Waveform ref="baseWaveform"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.audio-vocab {
    padding: 10px 0 10px 10px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 5px;

    &__controler {
        display: flex;   
        flex-direction: column;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
    }
    &__controler--icon {
        width: 70px;
        height: 70px;
    }
    &__controler--play-pause {
        width: 100%;
        padding: 4px 0;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #b4baad;
        background-color: aliceblue;
    }
    &__icon-play-pause {
        width: 15px;
        height: 15px;
        color: #77ac5f;
    }

    &__waveform {
        flex: 1;
        width: 100%;
        overflow: hidden;
        padding: 10px 10px 10px 0;
    }
}
</style>

<script setup lang="ts">
import Waveform from "./Waveform.vue";
import IconSpeak from "@/assets/voice.svg?component"
import { Play, Pause } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { type WaveformPayload } from "@/types/PayloadEventBusType.ts";
import { getDataElement } from "@/utils/utils.ts";

const isPlaying = ref(false);
const statePlayPause = computed(()=> { return isPlaying.value? Pause : Play });
const baseWaveform = ref<InstanceType<typeof Waveform> | null>(null);

onMounted(()=> {
    const audioUrl = getDataElement('url-audio');
    baseWaveform.value?.tryLoadUrl(audioUrl);
    baseWaveform.value!.waveformEvent.addEvent<WaveformPayload>('finish', ()=> { isPlaying.value = !isPlaying.value });
})

const isPlayPause = ()=> {
    isPlaying.value? baseWaveform.value!.pause() : baseWaveform.value!.play();
    isPlaying.value = !isPlaying.value;
}
</script>