import { getCanvasPath2D, getMousePos, type Point2D } from '@/utils/utils';
import { getStroke, type StrokeOptions, } from 'perfect-freehand';

export const useSketch = () => {
    const strokeOptions: StrokeOptions = {
        size: 5,
        thinning: 0.1,
        smoothing: 0.5,
        streamline: 0.4,
        easing: (t) => Math.sin((t * Math.PI) / 2),
        start: { taper: 0, cap: true },
        end: { taper: 0, cap: true }
    };

    const initializeCell = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        let isDrawing = false;
        let currentPoint: Point2D[] = [];
        const allStrokes: Point2D[][] = [];
        let cssWidth = 0;
        let cssHeight = 0;

        // Set canvas buffer đúng theo kích thước hiển thị thực tế + devicePixelRatio
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            cssWidth = rect.width;
            cssHeight = rect.height;

            canvas.width = Math.round(cssWidth * dpr);
            canvas.height = Math.round(cssHeight * dpr);

            // Reset transform trước khi scale lại (tránh cộng dồn khi resize nhiều lần)
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.scale(dpr, dpr);

            render(); // vẽ lại nét cũ vì resize sẽ xoá canvas
        };

        const render = () => {
            context.clearRect(0, 0, cssWidth, cssHeight);
            context.fillStyle = '#000000';

            // Vẽ tất cả các nét trước đó.
            for (const stroke of allStrokes) {
                if (stroke.length < 2) continue;
                const outline = getStroke(stroke, strokeOptions);
                context.fill(getCanvasPath2D(outline));
            }

            // Vẽ nét hiện tại.
            if (currentPoint.length > 2) {
                const currentOutline = getStroke(currentPoint, strokeOptions);
                context.fill(getCanvasPath2D(currentOutline));
            }
        };

        const handlePointerDown = (el: PointerEvent) => {
            isDrawing = true;
            currentPoint = [];
            currentPoint.push(getMousePos(canvas, el));
            render();
        };

        const handlePointerUp = () => {
            isDrawing = false;
            if (currentPoint.length > 0) {
                allStrokes.push([...currentPoint]);
                currentPoint = [];
            }
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

        // Trả về hàm cleanup để gọi khi unmount (xem lưu ý bên dưới)
        return () => {
            resizeObserver.disconnect();
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointerup', handlePointerUp);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerleave', handlePointerUp);
        };
    };

    return { initializeCell };
};