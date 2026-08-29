import './strokes';
import { StrokeComponent } from "./StrokeComponent";
import { Point2D } from "../utils/Math";
import { StrokeRegistry, type StrokeData } from "./StrokeRegistry";

export class Stroke {
    private strokeComponents: StrokeComponent[] = [];

    constructor(points: Point2D[]) {
        this.handleInput(points);
    }

    public draw(context: CanvasRenderingContext2D) {
        this.strokeComponents.forEach((comp: StrokeComponent)=> {
            comp.draw(context);
        });
    }

    public handleInput(points: Point2D[]) {
        // Kiểm tra và chia thành cách đường con.
        // Tại mỗi đường con hãy tính toán dữ liệu.

        const startIndex = Math.floor(points.length * 0.1);
        const endIndex = Math.floor(points.length * 0.9);

        const start = points[startIndex] || points[0];
        const end = points[endIndex] || points[points.length - 1];

        const radians = Math.atan2(end!.y - start!.y, end!.x - start!.x);
        const angle = (radians * 180) / Math.PI;

        const data: StrokeData = { points: points, angle: angle };
        const strokeComp = StrokeRegistry.createStroke(data);
        if (strokeComp) this.strokeComponents.push(strokeComp);
    }
}