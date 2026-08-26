import { getLength, Point2D } from "./Math";

export class Bezier {
    private p0 = new Point2D();
    private p1 = new Point2D();
    private p2 = new Point2D();
    private p3 = new Point2D();

    public initialize(points: Point2D[]) {
        if (!points || points.length < 2) return;

        this.p0 = points[0]!;
        this.p3 = points[points.length - 1]!;

        let lengthBezier = 0;
        for (let i = 0; i < points.length - 1; i++) {
            lengthBezier += getLength(points[i]!, points[i + 1]!);
        }    
        if (lengthBezier === 0) return;

        let sumB1Sq = 0, sumB1B2 = 0, sumB2Sq = 0;
        let sumB1Residual = new Point2D;
        let sumB2Residual = new Point2D;

        let accumulatedLength = 0;
        for (let i = 1; i < points.length - 1; i++) {
            const currentPoint = points[i]!;
            accumulatedLength += getLength(points[i - 1]!, currentPoint);

            const t = accumulatedLength / lengthBezier;
            const u = 1 - t;

            const b1 = 3 * u * u * t;
            const b2 = 3 * u * t * t;
            const residualX = currentPoint.x - u*u*u * this.p0.x - t*t*t * this.p3.x;
            const residualY = currentPoint.y - u*u*u * this.p0.y - t*t*t * this.p3.y;
            
            sumB1Sq += (b1*b1);
            sumB1B2 += (b1*b2);
            sumB2Sq += (b2*b2);
            
            sumB1Residual.x += (b1 * residualX);
            sumB1Residual.y += (b1 * residualY);
            sumB2Residual.x += (b2 * residualX);
            sumB2Residual.y += (b2 * residualY);            
        }

        let det = sumB1Sq*sumB2Sq - sumB1B2*sumB1B2;
        if (Math.abs(det) < 1e-6) return;

        this.p1.x = (sumB1Residual.x*sumB2Sq - sumB1B2*sumB2Residual.x) / det;
        this.p1.y = (sumB1Residual.y*sumB2Sq - sumB1B2*sumB2Residual.y) / det;

        this.p2.x = (sumB1Sq*sumB2Residual.x - sumB1Residual.x*sumB1B2) / det;
        this.p2.y = (sumB1Sq*sumB2Residual.y - sumB1Residual.y*sumB1B2) / det;
    }

    public getPointAt(t: number) {
        let point = new Point2D();
        const u = 1 - t;
        point.x = u*u*u*this.p0.x + (t*t*t)*this.p3.x + 3*u*u*t*this.p1.x + 3*u*t*t*this.p2.x;
        point.y = u*u*u*this.p0.y + (t*t*t)*this.p3.y + 3*u*u*t*this.p1.y + 3*u*t*t*this.p2.y;
        return point;
    }

    public getTangentAt(t: number) {
        let tangent = new Point2D();
        const u = 1 - t;
        tangent.x = 3*u*u*(this.p1.x - this.p0.x) + 6*u*t*(this.p2.x - this.p1.x) + 3*t*t*(this.p3.x - this.p2.x);
        tangent.y = 3*u*u*(this.p1.y - this.p0.y) + 6*u*t*(this.p2.y - this.p1.y) + 3*t*t*(this.p3.y - this.p2.y);
        return tangent;
    }

    public reset() {
        this.p0.x = 0; this.p0.y = 0;
        this.p1.x = 0; this.p1.y = 0;
        this.p2.x = 0; this.p2.y = 0;
        this.p3.x = 0; this.p3.y = 0;
    }

    public getStartPoint = ()=> this.p0;
    public getEndPoint = ()=> this.p3;
    public getFristControlPoint = ()=> this.p1;
    public getSecondControlPoint = ()=> this.p2;
}