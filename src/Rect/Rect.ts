import { RECT_SIZE } from "../common/constants";


export interface RectData {
    x: number;
    y: number;
    size: number;
};

export class Rect {
    constructor(startX?: number, startY?: number) {
        this._data = {
            x: startX || 0,
            y: startY || 0,
            size: RECT_SIZE
        }
    }

    private _data: RectData;

    get data() {
        return this._data;
    }
}