
export const getTimeStr = (t: number)=> {
    if (!isFinite(t) || t < 0) return '0:00'

    const minute = Math.floor(t / 60.0)
    const second = Math.floor(t % 60)
    return `${minute}:${second.toString().padStart(2, '0')}`
}

export const getDataElement = (className: string)=> {
    const urlAudioElement = document.querySelector('.' + className);
    let initialAudioUrl = '';

    if (urlAudioElement && urlAudioElement.textContent) {
        initialAudioUrl = urlAudioElement.textContent.trim();
        urlAudioElement.remove();
    }
    return initialAudioUrl;
}