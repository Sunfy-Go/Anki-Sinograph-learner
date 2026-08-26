export class Point2D {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

// Tính khoảng cách bình phương giữa hai điểm. 
export const getLength = (point1: Point2D, point2: Point2D)=> {
    return Math.sqrt((point2.x - point1.x) * (point2.x - point1.x) + (point2.y - point1.y) * (point2.y - point1.y));
}

// Chuẩn hóa vector.
export const normalize = (vector: Point2D)=> {
    let normalize = new Point2D();
    let length = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
    normalize.x = vector.x / length;
    normalize.y = vector.y / length;
    return normalize;
}

export const scale = (vector: Point2D, scale: number)=> {
    return new Point2D(vector.x * scale, vector.y * scale);
}