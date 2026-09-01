import { inRange } from "@/utils/utils";
import { StrokeComponent } from "../StrokeComponent";
import { StrokeRegistry, type StrokeData } from "../StrokeRegistry";

export class DotStroke extends StrokeComponent {
    private static readonly R_MAX = 8;
    private static readonly MIN_ANGLE_DEG = 30;
    private static readonly MAX_ANGLE_DEG = 70;
    
    static {
        StrokeRegistry.register((data: StrokeData)=> {
            if (!inRange(data.angle, DotStroke.MIN_ANGLE_DEG, DotStroke.MAX_ANGLE_DEG))
                return null;

            return new DotStroke(data);
        });
    }

    constructor(dataStroke: StrokeData) {
        super(dataStroke);
        this.generateOffsetPoints();
        this.calculateEndPoint(30, 10);
    }

    protected getWidthLeftAt(t: number): number {
        return DotStroke.R_MAX * (2*t - t*t);
    }

    protected getWidthRightAt(t: number): number {
        return DotStroke.R_MAX * (2*t - t*t);
    }

    protected drawHeadStroke(context: CanvasRenderingContext2D): void {}

    protected drawTailStroke(context: CanvasRenderingContext2D): void { 
        const rightPoint = this.rightOffsetPoints[this.rightOffsetPoints.length - 1];
        context.quadraticCurveTo(this.endPoint.x, this.endPoint.y, rightPoint!.x, rightPoint!.y);
    }
}