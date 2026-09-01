import { inRange } from "@/utils/utils";
import { StrokeComponent } from "../StrokeComponent";
import { StrokeRegistry, type StrokeData } from "../StrokeRegistry";

// Nét Hất (Rising stroke) với nét Mác (right falling stroke) có điểm tương đồng
// - Khi xét điều kiện góc.
export class RisingStroke extends StrokeComponent {
    private static readonly R_MAX = 10;
    private static readonly R_MIN = this.R_MAX * 0.2;
    private static readonly MIN_ANGLE_DEG = -60;
    private static readonly MAX_ANGLE_DEG = -20;

    static {
        StrokeRegistry.register((data: StrokeData)=> {
            // Xét điều kiện góc.
            if (!inRange(data.angle, RisingStroke.MIN_ANGLE_DEG, RisingStroke.MAX_ANGLE_DEG))
                return null;

            return new RisingStroke(data);
        });
    }

    constructor(dataStroke: StrokeData) {
        super(dataStroke);
        this.generateOffsetPoints();
        this.calculateStartPoint(7, 10);
        this.calculateEndPoint(5, 0);
    }

    protected getWidthLeftAt(t: number): number {
        return RisingStroke.R_MIN + (RisingStroke.R_MAX - RisingStroke.R_MIN) * (1-t);
    }

    protected getWidthRightAt(t: number): number {
        return RisingStroke.R_MIN + (RisingStroke.R_MAX - RisingStroke.R_MIN) * (1-t);
    }

    protected drawHeadStroke(context: CanvasRenderingContext2D): void {
        context.moveTo(this.rightOffsetPoints[0]!.x, this.rightOffsetPoints[0]!.y);
        context.quadraticCurveTo(this.startPoint.x, this.startPoint.y, this.leftOffsetPoints[1]!.x, this.leftOffsetPoints[1]!.y);
    }

    protected drawTailStroke(context: CanvasRenderingContext2D): void {
        const lastRight = this.rightOffsetPoints[this.rightOffsetPoints.length - 1]!;
        context.quadraticCurveTo(this.endPoint.x, this.endPoint.y, lastRight.x, lastRight.y);
    }
}