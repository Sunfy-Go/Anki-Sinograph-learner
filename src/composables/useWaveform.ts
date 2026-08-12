import { onBeforeUnmount, shallowRef } from "vue";
import WaveSurfer, { type WaveSurferOptions } from "wavesurfer.js"
import { EventBus } from "@/utils/EventBus";
import type { WaveformPayload } from "@/types/PayloadEventBusType";
import type { WavesurferEventName } from "@/types/WaveformTypes";

export const useWaveform = ()=> {
    const waveform = shallowRef<WaveSurfer | null>(null);
    const waveformEvent = shallowRef<EventBus<WavesurferEventName>>(new EventBus<WavesurferEventName>);   

    onBeforeUnmount(()=> {
        waveformEvent.value.clearAllEvent();
        if (!waveform.value) return;
        waveform.value.unAll();
        waveform.value.destroy();
        waveform.value = null;
    });

    const setupEvent = ()=> {
        waveform.value?.on('finish', ()=> waveformEvent.value.emitEvent<WaveformPayload>('finish', {}));
        waveform.value?.on('ready', ()=> waveformEvent.value.emitEvent<WaveformPayload>('ready', {}));
        waveform.value?.on('audioprocess', ()=> waveformEvent.value.emitEvent<WaveformPayload>('audioprocess', {}));
        waveform.value?.on('seeking', ()=> waveformEvent.value.emitEvent<WaveformPayload>('seeking', {}));
    }

    const create = (options: WaveSurferOptions)=> {
        waveform.value = WaveSurfer.create(options);
        setupEvent();
        return waveform.value;
    }

    const tryLoadUrl = (url: string)=> {
        try {
            waveform.value?.load(url);
        } catch (error) {
            console.error("Failed to initialize wavesufer. Error load url: ", error);
        }
    }

    const stop  = ()=> waveform.value?.stop();
    const play  = ()=> waveform.value?.play();
    const pause = ()=> waveform.value?.pause();
    const setSpeed = (speed: number)=> waveform.value?.setPlaybackRate(speed);
    const getDuration = ()=> waveform.value?.getDuration();
    const getCurrentTime = ()=> waveform.value?.getCurrentTime();

    return { waveformEvent, create, tryLoadUrl, play, pause, setSpeed, stop, getDuration, getCurrentTime }
}