export type Point2D = [number, number];

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

// Tính khoảng cách giữa hai điểm 
export const getDist = (vector1: Point2D, vector2: Point2D): number => {
    const dx = vector2[0] - vector1[0];
    const dy = vector2[1] - vector1[1];
    return Math.hypot(dx, dy);
}

export const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent | PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return [evt.clientX - rect.left, evt.clientY - rect.top] as Point2D;
};

// Lấy vị trí thực tế trên cavas.
// export const getMousePos = (canvas: HTMLCanvasElement, event: MouseEvent): Point2D => {
//     var rect = canvas.getBoundingClientRect();
    
//     // Tính tỉ lệ scaling (nếu kích thước hiển thị CSS khác với thuộc tính width/height của canvas)
//     var scaleX = canvas.width / rect.width;
//     var scaleY = canvas.height / rect.height;

//     return [
//         (event.clientX - rect.left) * scaleX,
//         (event.clientY - rect.top) * scaleY
//     ];
// }

export const getCanvasPath2D = (strokeOutline: Point2D[]): Path2D => {
    const path = new Path2D();
    if (strokeOutline.length === 0) return path;

    const [firstPoint, ...restPoints] = strokeOutline;
    path.moveTo(firstPoint?.[0]!, firstPoint?.[1]!);
    for (const [x, y] of restPoints) {
        path.lineTo(x, y);
    }
    path.closePath();
    return path;
};