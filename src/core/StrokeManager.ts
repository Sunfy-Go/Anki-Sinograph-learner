import type { Point2D } from "../utils/Math";
import { Stroke } from "./Stroke";

export class StrokeManager {
    private strokes: Stroke[] = [];
    private index: number = -1;

    public draw(context: CanvasRenderingContext2D): void {
        for(let i = 0; i <= this.index; i++) {
            this.strokes[i]?.draw(context);
        }
    } 

    public addStroke(points: Point2D[]): void {
        if (points.length === 0) return;

        // Xóa các phần tử từ vị trí kế tiếp trở đi nếu đang ở quá khứ undo.
        if (this.index < this.strokes.length - 1) {
            this.strokes.splice(this.index + 1);
        }

        // Thêm nét mới và dịch chuyển vị trí đến nét mới.
        this.strokes.push(new Stroke(points));
        this.index = this.strokes.length - 1;
    }

    // Hủy bỏ thao tác vừa làm.
    // ------------------------
    public undo(): void {
        if (this.index < 0) return;
        this.index--;
    }

    // Khôi phục thao tác vùa hủy bỏ. 
    // ------------------------------
    public redo(): void {
        if (this.index >= this.strokes.length -1) return;
        this.index++;
    }

    // Xóa toàn bộ các nét đã vẽ.
    // --------------------------
    public clear(): void {
        this.strokes = [];
        this.index = 0;
    }
}