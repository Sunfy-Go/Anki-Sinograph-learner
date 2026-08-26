import { Bezier } from "./Bezier";
import { normalize, Point2D, scale } from "./Math";


// Nơi lưu trữ một nét do người dùng vẽ.
// Bao gồm một mảng các điểm đã chế biến.
// Chia các nét gấp khúc thành các nét đơn lẻ và nối lại.
// Đối chiếu đặc điểm của nét đơn lẻ xem nó thuộc loại nét nào.

export class Stroke {
    private bezier: Bezier = new Bezier();
    private rMax: number = 8;
    private rMin: number = this.rMax * 0.7;
    private arrLeft: Point2D[] = [];
    private arrRight: Point2D[] = [];
    private isTangentLine: boolean = true;


    public initialize(point: Point2D[]) {
        this.bezier.initialize(point);
        this.create();
    }

    public draw(context: CanvasRenderingContext2D) {
        if (!this.arrLeft?.length || !this.arrRight?.length) return;

        // Tạo nét đầu
        const pStart = this.bezier.getStartPoint();
        const tanStart = normalize(this.bezier.getTangentAt(0));
        const firstPoint = new Point2D(pStart.x - tanStart.x * 30, pStart.y - tanStart.y * 40 - 7); // Dịch tâm điều khiển lên trên 7 đơn vị (trục y hướng xuống).

        context.beginPath();
        context.moveTo(this.arrRight[0]!.x, this.arrRight[0]!.y);
        context.quadraticCurveTo(firstPoint.x, firstPoint.y, this.arrLeft[0]!.x, this.arrLeft[0]!.y);

        // Vẽ viền dưới. 
        for (let i = 1; i < this.arrLeft.length; i++) {
            context.lineTo(this.arrLeft[i]!.x, this.arrLeft[i]!.y);
        }

        // Tạo nét cuối.
        const pEnd = this.bezier.getEndPoint();
        const tanEnd = normalize(this.bezier.getTangentAt(1));
        const endPoint = new Point2D(pEnd.x + tanEnd.x * 30, pEnd.y + tanEnd.y * 30 + 10);
        context.quadraticCurveTo(endPoint.x, endPoint.y, this.arrRight[this.arrRight.length - 1]!.x, this.arrRight[this.arrRight.length - 1]!.y);

        // Vẽ viền trên.
        for (let i = this.arrRight.length - 1; i >= 0 ; i--) {
            context.lineTo(this.arrRight[i]!.x, this.arrRight[i]!.y);
        }
        context.closePath();
        context.fill();

        if (this.isTangentLine) {
            let n = 20;
            context.globalCompositeOperation = "xor";
            for (let i = 0; i < n - 1; i++) {
                let t = i / (n - 1);
                let currentPoint = this.bezier.getPointAt(t);
                let tangentI = this.bezier.getTangentAt(t); 
                let vecTanNor = scale(normalize(tangentI), 10);
                this.drawVector(currentPoint, vecTanNor, context);
            }
            context.globalCompositeOperation = "source-over";
        }        
    }

    private create() {
        this.arrLeft = [];
        this.arrRight = [];
        let n = 20;

        // Cần xác định là nét gì để tạo viền thân tương ứng.
        // Cái này dành cho nét ngang và nét sổ thẳng.
        for (let i = 0; i < n; i++) {
            let t = i / (n - 1);
            
            let tangent = normalize(this.bezier.getTangentAt(t));
            let normalLeft = new Point2D(-tangent.y, tangent.x)
            let normalRight = new Point2D(tangent.y, -tangent.x);

            let w = this.getW(t);
            let vecLeft = new Point2D(normalLeft.x * w, normalLeft.y * w);
            let vecRight = new Point2D(normalRight.x * w, normalRight.y * w);
            
            let currentPoint = this.bezier.getPointAt(t);
            let pointLeft = new Point2D(currentPoint.x + vecLeft.x, currentPoint.y + vecLeft.y);
            let pointRight = new Point2D(currentPoint.x + vecRight.x, currentPoint.y + vecRight.y);

            this.arrLeft.push(pointLeft);
            this.arrRight.push(pointRight);
        }
    }

    private drawVector(point: Point2D, vector: Point2D, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x + vector.x, point.y + vector.y);
        ctx.stroke();
    }

    // Dùng parabol để tạo thân nét cho nét ngang và nét sổ.
    private getW(t: number) {
        return this.rMin + 4*(t-0.5)*(t-0.5) * (this.rMax - this.rMin);
    }
}