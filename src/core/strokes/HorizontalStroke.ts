import { StrokeComponent } from "../StrokeComponent";
import { normalize, Point2D } from "../../utils/Math";
import { StrokeRegistry, type StrokeData } from "../StrokeRegistry";
import { inRange } from "@/utils/utils";

export class HorizontalStroke extends StrokeComponent {
    private static readonly R_MAX = 8;
    private static readonly R_MIN = this.R_MAX * 0.7;

    private static readonly MIN_ANGLE_DEG = -11;
    private static readonly MAX_ANGLE_DEG = 11;

    static {
        StrokeRegistry.register((data: StrokeData)=> {
            if (!inRange(data.angle, HorizontalStroke.MIN_ANGLE_DEG, HorizontalStroke.MAX_ANGLE_DEG))
                return null;

            return new HorizontalStroke(data);
        });
    }

    constructor(strokeData: StrokeData) {
        super(strokeData);
        this.generateOffsetPoints();
    }

    public drawComponent(context: CanvasRenderingContext2D): void {
        if (!this.leftOffsetPoints?.length || !this.rightOffsetPoints?.length) 
            return;

        context.beginPath();
        this.drawHeadStroke(context);

        // Nối các điểm lại với nhau.
        for (let i = 0; i < this.leftOffsetPoints.length; i++) {
            context.lineTo(this.leftOffsetPoints[i]!.x, this.leftOffsetPoints[i]!.y);
        }
        this.drawTailStroke(context);

        for (let i = this.rightOffsetPoints.length - 1; i >= 0; i--) {
            context.lineTo(this.rightOffsetPoints[i]!.x, this.rightOffsetPoints[i]!.y);
        }
        context.closePath();
        context.fill();
    }

    protected getWidthAt(t: number): number {
        return HorizontalStroke.R_MIN + 4*(t-0.5)*(t-0.5) * (HorizontalStroke.R_MAX - HorizontalStroke.R_MIN);;
    }

    private drawHeadStroke(context: CanvasRenderingContext2D) {
        const pStart = this.bezier.getStartPoint();
        const tanStart = normalize(this.bezier.getTangentAt(0));
        const firstPoint = new Point2D(pStart.x - tanStart.x * 30, pStart.y - tanStart.y * 40 - 7); // Dịch tâm điều khiển lên trên 7 đơn vị (trục y hướng xuống).
        context.moveTo(this.rightOffsetPoints[0]!.x, this.rightOffsetPoints[0]!.y);
        context.quadraticCurveTo(firstPoint.x, firstPoint.y, this.leftOffsetPoints[0]!.x, this.leftOffsetPoints[0]!.y);
    }

    private drawTailStroke(context: CanvasRenderingContext2D) {
        const pEnd = this.bezier.getEndPoint();
        const tanEnd = normalize(this.bezier.getTangentAt(1));
        const endPoint = new Point2D(pEnd.x + tanEnd.x * 30, pEnd.y + tanEnd.y * 30 + 10);
        context.quadraticCurveTo(endPoint.x, endPoint.y, this.rightOffsetPoints[this.rightOffsetPoints.length - 1]!.x, this.rightOffsetPoints[this.rightOffsetPoints.length - 1]!.y);
    }
}