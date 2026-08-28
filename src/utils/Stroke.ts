import { StrokeComponent } from "./StrokeComponent";
import { HorizontalStroke } from "./HorizontalStroke";
import { Point2D } from "./Math";

export class Stroke {
    private strokeComponents: StrokeComponent[] = [];

    constructor(points: Point2D[]) {
        let component = new HorizontalStroke(points); 
        this.strokeComponents.push(component);
    }

    public draw(context: CanvasRenderingContext2D) {
        this.strokeComponents.forEach((comp: StrokeComponent)=> {
            comp.draw(context);
        });
    }
}