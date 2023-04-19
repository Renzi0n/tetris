import { FIELD_SIZE, RECT_SIZE } from "../common/constants";

export class Field {
    constructor() {
        this.data = Array(FIELD_SIZE.H / RECT_SIZE).fill(Array(FIELD_SIZE.W / RECT_SIZE).fill(false))
    }

    data: boolean[][] = [];
}