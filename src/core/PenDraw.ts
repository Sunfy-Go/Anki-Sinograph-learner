import type { Point2D } from "@/utils/Math";
import { getCanvasPath2D } from "@/utils/utils";
import getStroke, { type StrokeOptions } from "perfect-freehand";

export class PenDraw {
    private strokeOptions: StrokeOptions = {
        size: 1,
        thinning: 0.1,
        smoothing: 0.5,
        streamline: 0.4,
        easing: (t) => Math.sin((t * Math.PI) / 2),
        start: { taper: 0, cap: true },
        end: { taper: 0, cap: true }
    };

    public draw(context: CanvasRenderingContext2D, points: Point2D[]): void {
        if (points.length < 2) return;

        const currentOutline = getStroke(points, this.strokeOptions);
        context.fill(getCanvasPath2D(currentOutline));
    }
}