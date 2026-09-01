import { StrokeComponent } from "../StrokeComponent";
import { StrokeRegistry, type StrokeData } from "../StrokeRegistry";
import { inRange } from "@/utils/utils";

export class LeftFallingStroke extends StrokeComponent {
    private static readonly R_MAX = 10;
    private static readonly R_MIN = this.R_MAX * 0.6;
    private static readonly MIN_ANGLE_DEG = 120;
    private static readonly MAX_ANGLE_DEG = 145;

    static {
        StrokeRegistry.register((data: StrokeData)=> {
            if (!inRange(data.angle, LeftFallingStroke.MIN_ANGLE_DEG, LeftFallingStroke.MAX_ANGLE_DEG))
                return null;

            return new LeftFallingStroke(data);
        });
    }

    constructor(dataStroke: StrokeData) {
        super(dataStroke);
        this.generateOffsetPoints();
        this.calculateStartPoint(30, 24);
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
        if (t < 0.2) return LeftFallingStroke.R_MAX*0.8;

        const u = (t - 0.2) / 0.8;
        const factor = 0.5 * (1 + Math.cos(Math.PI * u));
        return LeftFallingStroke.R_MIN*0.7 + (LeftFallingStroke.R_MAX*0.7 - LeftFallingStroke.R_MIN*0.7) * factor;
    }

    protected getWidthRightAt(t: number): number {
        return t + LeftFallingStroke.R_MIN;
    }
}