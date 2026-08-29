import type { Point2D } from "../utils/Math";
import type { StrokeComponent } from "./StrokeComponent";

//  Tạo kiểu hàm tạo chứa công thức nhận diện của từng nét thành phần.
type StrokeCreator = (data: StrokeData) => StrokeComponent | null;

export type StrokeData = {
    points: Point2D[];
    angle: number;
}

export class StrokeRegistry {
    private static handlers: StrokeCreator[] = [];

    public static createStroke(data: StrokeData): StrokeComponent | null {
        for (const handler of this.handlers) {
            const instance = handler(data);
            if (instance) return instance;
        }
        return null
    }

    public static register(handler: StrokeCreator) {
        this.handlers.push(handler);
    }
}