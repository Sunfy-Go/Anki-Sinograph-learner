import { inRange } from "@/utils/utils";
import { StrokeComponent } from "../StrokeComponent";
import { StrokeRegistry, type StrokeData } from "../StrokeRegistry";

export class RightFallingStroke extends StrokeComponent {
    private static readonly R_MAX = 10;
    private static readonly R_MIN = this.R_MAX * 0.3;
    private static readonly MIN_ANGLE_DEG = 30;
    private static readonly MAX_ANGLE_DEG = 50;
    private static readonly TAPER_POWER = 3;

    static {
        StrokeRegistry.register((data: StrokeData)=> {
            if (!inRange(data.angle, RightFallingStroke.MIN_ANGLE_DEG, RightFallingStroke.MAX_ANGLE_DEG))
                return null;

            return new RightFallingStroke(data);
        });
    }

    constructor(dataStroke: StrokeData) {
        super(dataStroke);
        this.generateOffsetPoints();
        this.calculateStartPoint(10, 24);
        this.calculateEndPoint(30, 10);
    }

    private taper(t: number): number {
        const { R_MAX, R_MIN, TAPER_POWER } = RightFallingStroke;
        const eased = Math.pow(t, TAPER_POWER);
        // const eased = Math.pow(1 - t, TAPER_POWER);
        return R_MIN + (R_MAX - R_MIN) * eased;
    }

    protected getWidthLeftAt(t: number): number {
        return this.taper(t);
    }

    protected getWidthRightAt(t: number): number {
        return this.taper(t);
    }

    protected drawHeadStroke(context: CanvasRenderingContext2D): void {
        context.moveTo(this.rightOffsetPoints[0]!.x, this.rightOffsetPoints[0]!.y);
        context.quadraticCurveTo(this.startPoint.x, this.startPoint.y, this.leftOffsetPoints[0]!.x, this.leftOffsetPoints[0]!.y);
    }

    protected drawTailStroke(context: CanvasRenderingContext2D): void {
        const lastRight = this.rightOffsetPoints[this.rightOffsetPoints.length - 1]!;
        context.quadraticCurveTo(this.endPoint.x, this.endPoint.y, lastRight.x, lastRight.y);
    }
}