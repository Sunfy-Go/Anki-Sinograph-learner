<template>
    <span class="time-display">{{ getTimeStr(currentTime) }} / {{ getTimeStr(duration) }}</span>
</template>

<style lang="scss" scoped>
.time-display {
    bottom: -10px;
    right: 10px;
    position: absolute;
    color: #9c9c9c;
    font-size: 14px;
}
</style>

<script setup lang="ts">
import { getTimeStr } from '@/utils/utils';

defineProps<{ currentTime: number, duration: number }>();
</script>