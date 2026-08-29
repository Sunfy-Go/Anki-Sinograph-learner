import { getMousePos } from '@/utils/utils';
import type { Point2D } from '@/utils/Math';
import { StrokeManager } from '@/core/StrokeManager';
import { PenDraw } from '@/core/PenDraw';

export const useSketch = () => {
    let isDrawing = false;
    let cssWidth = 0;
    let cssHeight = 0;

    let canvasEl: HTMLCanvasElement | null = null;
    let context: CanvasRenderingContext2D | null = null;
    
    let currentPoint: Point2D[] = [];
    let penDraw: PenDraw = new PenDraw();
    let strokeManager: StrokeManager = new StrokeManager();


    const initializeCell = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;

        canvasEl = canvas;
        context = canvas.getContext('2d');
        if (!context) return;

        const handlePointerDown = (el: PointerEvent) => {
            isDrawing = true;
            currentPoint = [];
            currentPoint.push(getMousePos(canvas, el));
        };

        const handlePointerUp = () => {
            isDrawing = false;
            if (currentPoint.length <= 0) return;
            strokeManager.addStroke(currentPoint);
            currentPoint = [];
            render();
        };

        const handlePointerMove = (el: PointerEvent) => {
            if (!isDrawing) return;
            currentPoint.push(getMousePos(canvas, el));
            render();
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerleave', handlePointerUp);

        // Theo dõi thay đổi kích thước khung (responsive/resize màn hình)
        const resizeObserver = new ResizeObserver(() => resizeCanvas());
        resizeObserver.observe(canvas);
        resizeCanvas();

        // Trả về hàm dọn dẹp Event Listeners
        return () => {
            resizeObserver.disconnect();
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerleave', handlePointerUp);
        };
    };

    const undo = ()=> {
        strokeManager.undo();
        console.log("Undo");
        render();
    }

    const redo = ()=> {
        strokeManager.redo();
        render();
    }

    const clear = ()=> {
        strokeManager.clear();
        render();
    }

    // Set canvas buffer đúng theo kích thước hiển thị thực tế + devicePixelRatio
    const resizeCanvas = () => {
        if (!canvasEl || !context) return;

        const rect = canvasEl.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        cssWidth = rect.width;
        cssHeight = rect.height;

        canvasEl.width = Math.round(cssWidth * dpr);
        canvasEl.height = Math.round(cssHeight * dpr);

        // Reset transform trước khi scale lại (tránh cộng dồn khi resize nhiều lần)
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(dpr, dpr);

        // Vẽ lại nét cũ vì resize sẽ xoá canvas
        render(); 
    };

    const render = () => {
        if (!context) return;
        context.clearRect(0, 0, cssWidth, cssHeight);
        context.fillStyle = '#ac5e5e';
        penDraw.draw(context, currentPoint);
        strokeManager.draw(context);
    };


    return { initializeCell, undo, redo, clear };
};