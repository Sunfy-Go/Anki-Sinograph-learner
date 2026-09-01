import { Bezier } from "../utils/Bezier";
import { normalize, Point2D, scale } from "../utils/Math";
import type { StrokeData } from "./StrokeRegistry";

// Một giao diện đại diện cho một nét cụ thể.
// ------------------------------------------
export abstract class StrokeComponent {
    protected bezier: Bezier;
    protected leftOffsetPoints: Point2D[] = [];
    protected rightOffsetPoints: Point2D[] = [];
    private isTangentLine: boolean = false;

    protected startPoint: Point2D = new Point2D();
    protected endPoint: Point2D = new Point2D();

    private readonly COUNT_POINT = 20;


    public constructor(strokeData: StrokeData) {
        this.bezier = new Bezier(strokeData.points);
    }

    protected abstract drawHeadStroke(context: CanvasRenderingContext2D): void;
    protected abstract drawTailStroke(context: CanvasRenderingContext2D): void;
    protected abstract getWidthLeftAt(t: number): number;
    protected abstract getWidthRightAt(t: number): number;


    public draw(context: CanvasRenderingContext2D): void {
        this.drawComponent(context);

        if (this.isTangentLine) 
            this.drawTargetLine(context);
    }

    protected drawComponent(context: CanvasRenderingContext2D): void {
        if (!this.leftOffsetPoints?.length || !this.rightOffsetPoints?.length) 
            return;

        context.beginPath();
        this.drawHeadStroke(context);
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

    protected generateOffsetPoints(): void {
        for (let i = 0; i < this.COUNT_POINT; i++) {
            const t = i / (this.COUNT_POINT - 1);

            let tangent = normalize(this.bezier.getTangentAt(t));
            let normalLeft = new Point2D(-tangent.y, tangent.x)
            let normalRight = new Point2D(tangent.y, -tangent.x);

            let wLeft = this.getWidthLeftAt(t);
            let vecLeft = new Point2D(normalLeft.x * wLeft, normalLeft.y * wLeft);

            let wRight = this.getWidthRightAt(t);
            let vecRight = new Point2D(normalRight.x * wRight, normalRight.y * wRight);
            
            let currentPoint = this.bezier.getPointAt(t);
            let pointLeft = new Point2D(currentPoint.x + vecLeft.x, currentPoint.y + vecLeft.y);
            let pointRight = new Point2D(currentPoint.x + vecRight.x, currentPoint.y + vecRight.y);

            this.leftOffsetPoints.push(pointLeft);
            this.rightOffsetPoints.push(pointRight);
        }
    }

    protected calculateStartPoint(backwardDistance: number, outwardDistance: number): void {
        const pStart = this.bezier.getStartPoint();
        const tanStart = normalize(this.bezier.getTangentAt(0));

        this.startPoint.x = pStart.x - tanStart.x * backwardDistance - outwardDistance;
        this.startPoint.y = pStart.y - tanStart.y * backwardDistance;
    }

    protected calculateEndPoint(backwardDistance: number, outwardDistance: number): void { 
        const pEnd = this.bezier.getEndPoint();
        const tanEnd = normalize(this.bezier.getTangentAt(1));

        this.endPoint.x = pEnd.x + tanEnd.x*backwardDistance;
        this.endPoint.y = pEnd.y + tanEnd.y*backwardDistance + outwardDistance;
    }

    private drawTargetLine(context: CanvasRenderingContext2D) {
        context.globalCompositeOperation = "xor";
        for (let i = 0; i < this.COUNT_POINT - 1; i++) {
            let t = i / (this.COUNT_POINT - 1);
            let currentPoint = this.bezier.getPointAt(t);
            let tangentI = this.bezier.getTangentAt(t); 
            let vecTanNor = scale(normalize(tangentI), 10);
            this.drawVectorHelper(currentPoint, vecTanNor, context);
        }
        context.globalCompositeOperation = "source-over";
    }

    private drawVectorHelper(point: Point2D, vector: Point2D, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x + vector.x, point.y + vector.y);
        ctx.stroke();
    }
}