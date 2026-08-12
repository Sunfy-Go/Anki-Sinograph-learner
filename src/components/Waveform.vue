<template>
    <div class="waveform" ref="waveformContainer">
        <TimeDisplay :current-time="currentTimeRef" :duration="durationRef"/>
    </div>
</template>

<style lang="scss" scoped>
.waveform {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 0;
    flex-grow: 1;

    :deep(::part(canvases)) {
        margin-top: 4px;
    }
    :deep(::part(scroll)) {
        height: 100%;
        padding-bottom: 10px;
        outline: none;      
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWaveform } from '@/composables/useWaveform';
import type { WaveformPayload } from '@/types/PayloadEventBusType';
import TimeDisplay from './TimeDisplay.vue';

const currentTimeRef = ref<number>(0);
const durationRef = ref<number>(0);
const waveformContainer = ref<HTMLElement>();
const { waveformEvent, create, tryLoadUrl, play, pause, setSpeed, stop, getDuration, getCurrentTime } = useWaveform();

onMounted(()=> {
    create({
        container: waveformContainer.value!,
        waveColor: '#d6e1c1',
        progressColor: '#58b5d6',
        cursorColor: '#f5f5f5',
        height: 70,
        barWidth: 2.7,
        cursorWidth: 1.5,   
        dragToSeek: true,
        normalize: true,
        backend: 'WebAudio',
    });
    setupWaveform();
});

const setupWaveform = ()=> {
    waveformEvent.value.addEvent<WaveformPayload>('finish', ()=> { stop(); currentTimeRef.value = 0 });
    waveformEvent.value.addEvent<WaveformPayload>('ready', ()=> { durationRef.value = getDuration() || 0 });
    waveformEvent.value.addEvent<WaveformPayload>('audioprocess', ()=> { currentTimeRef.value = getCurrentTime() || 0 });
    waveformEvent.value.addEvent<WaveformPayload>('seeking', ()=> { currentTimeRef.value = getCurrentTime() || 0 });
}

defineExpose({ waveformEvent, tryLoadUrl, play, pause, setSpeed, stop });
</script>