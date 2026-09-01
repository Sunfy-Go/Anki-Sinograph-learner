import { StrokeComponent } from "../StrokeComponent";
import { StrokeRegistry, type StrokeData } from "../StrokeRegistry";
import { inRange } from "@/utils/utils";

export class VerticalStroke extends StrokeComponent {
    private static readonly R_MAX = 10;
    private static readonly R_MIN = this.R_MAX * 0.6;
    private static readonly MIN_ANGLE_DEG = 80;
    private static readonly MAX_ANGLE_DEG = 100;

    static {
        StrokeRegistry.register((data: StrokeData)=> {
            if (!inRange(data.angle, VerticalStroke.MIN_ANGLE_DEG, VerticalStroke.MAX_ANGLE_DEG))
                return null;

            return new VerticalStroke(data);
        });
    }

    constructor(strokeData: StrokeData) {
        super(strokeData);
        this.generateOffsetPoints();
        this.calculateStartPoint(20, 24);
        this.calculateEndPoint(30, 10);
    }

    protected drawHeadStroke(context: CanvasRenderingContext2D) {
        context.moveTo(this.rightOffsetPoints[0]!.x, this.rightOffsetPoints[0]!.y);
        context.quadraticCurveTo(this.startPoint.x, this.startPoint.y, this.leftOffsetPoints[0]!.x, this.leftOffsetPoints[0]!.y);
    }

    protected drawTailStroke(context: CanvasRenderingContext2D) {
        context.quadraticCurveTo(this.endPoint.x, this.endPoint.y, this.rightOffsetPoints[this.rightOffsetPoints.length - 1]!.x, this.rightOffsetPoints[this.rightOffsetPoints.length - 1]!.y);
    }

    protected getWidthLeftAt(t: number): number {
        if (t >= 0.6) return t + VerticalStroke.R_MIN;
        return VerticalStroke.R_MIN + 4*(t-0.5)*(t-0.5) * (VerticalStroke.R_MAX - VerticalStroke.R_MIN);
    }

    protected getWidthRightAt(t: number): number {
        return t + VerticalStroke.R_MIN;
    }
}