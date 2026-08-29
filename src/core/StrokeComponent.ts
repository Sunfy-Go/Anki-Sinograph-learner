import { Bezier } from "../utils/Bezier";
import { normalize, Point2D } from "../utils/Math";
import type { StrokeData } from "./StrokeRegistry";

// Một giao diện đại diện cho một nét cụ thể.
// ------------------------------------------
export abstract class StrokeComponent {
    protected bezier: Bezier;
    protected leftOffsetPoints: Point2D[] = [];
    protected rightOffsetPoints: Point2D[] = [];

    private readonly COUNT_POINT = 20;


    public constructor(strokeData: StrokeData) {
        this.bezier = new Bezier(strokeData.points);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.drawComponent(context);
        // Ở đây có thể debug được.
    }

    protected abstract drawComponent(context: CanvasRenderingContext2D): void;
    protected abstract getWidthAt(t: number): number;

    protected generateOffsetPoints(): void {
        for (let i = 0; i < this.COUNT_POINT; i++) {
            const t = i / (this.COUNT_POINT - 1);

            let tangent = normalize(this.bezier.getTangentAt(t));
            let normalLeft = new Point2D(-tangent.y, tangent.x)
            let normalRight = new Point2D(tangent.y, -tangent.x);

            let w = this.getWidthAt(t);
            let vecLeft = new Point2D(normalLeft.x * w, normalLeft.y * w);
            let vecRight = new Point2D(normalRight.x * w, normalRight.y * w);
            
            let currentPoint = this.bezier.getPointAt(t);
            let pointLeft = new Point2D(currentPoint.x + vecLeft.x, currentPoint.y + vecLeft.y);
            let pointRight = new Point2D(currentPoint.x + vecRight.x, currentPoint.y + vecRight.y);

            this.leftOffsetPoints.push(pointLeft);
            this.rightOffsetPoints.push(pointRight);
        }
    }


    // private drawTargetLine(context: CanvasRenderingContext2D) {
    //     if (!this.isTangentLine) return;

    //     context.globalCompositeOperation = "xor";
    //     for (let i = 0; i < this.COUNT_POINTs - 1; i++) {
    //         let t = i / (this.COUNT_POINTs - 1);
    //         let currentPoint = this.bezier.getPointAt(t);
    //         let tangentI = this.bezier.getTangentAt(t); 
    //         let vecTanNor = scale(normalize(tangentI), 10);
    //         this.drawVectorHelper(currentPoint, vecTanNor, context);
    //     }
    //     context.globalCompositeOperation = "source-over";
    // }

    // private drawVectorHelper(point: Point2D, vector: Point2D, ctx: CanvasRenderingContext2D) {
    //     ctx.beginPath();
    //     ctx.moveTo(point.x, point.y);
    //     ctx.lineTo(point.x + vector.x, point.y + vector.y);
    //     ctx.stroke();
    // }
    // Thêm hàm kiểm tra xem danh sách điểm thuộc loại thành phần nét nào.



            // if (t < 0.2) return this.rMax*0.8;
            // const u = (t - 0.2) / 0.8;
            // const factor = 0.5 * (1 + Math.cos(Math.PI * u));
            // return this.rMin*0.7 + (this.rMax*0.7 - this.rMin*0.7) * factor;
}