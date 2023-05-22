import { FIGURES, FIELD } from "../common";


export interface RectData {
    x: number;
    y: number;
    size: number;
    active: boolean;
    filled: boolean;
    color?: FIGURES;
};

export class Rect {
    constructor(startX?: number, startY?: number, color?: FIGURES) {
        this._data = {
            x: startX || 0,
            y: startY || 0,
            size: FIELD.RECT_SIZE,
            active: false,
            filled: false,
            color,
        }
    }

    private _data: RectData;

    get data() {
        return this._data;
    }

    get x() {
        return this._data.x;
    }

    get color() {
        return this._data.color;
    }

    set color(color: FIGURES | undefined) {
        this._data.color = color;
    }

    get y() {
        return this._data.y;
    }

    set y(y: number) {
        this._data.y = y;
    }

    get active() {
        return this._data.active;
    }

    set active(value: boolean) {
        this._data.active = value;
    }

    get filled() {
        return this._data.filled;
    }

    set filled(value: boolean) {
        this._data.filled = value;
    }

    activate = (color?: FIGURES) => {
        if (!this._data.active && !this._data.filled) {
            this._data.active = true;
            this._data.filled = true;
            this._data.color = color;
        }
    }

    disactivate = () => {
        this._data.active = false;
    }

    off = () => {
        this._data.active = false;
        this._data.filled = false;
        this._data.color = undefined;
    }
}