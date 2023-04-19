import { FIELD_SIZE, RECT_SIZE } from "../common/constants";
import { getRandomInt } from "../common/helpers";
import { Rect } from "../Rect";


const RECT_COUNT = 4;

export class Figure {
    constructor() {
        this._makeRandomFigure()
    }

    private _data: Rect[] = [];

    get data() {
        return this._data;
    }

    get height() {
        return this._data.reduce((acc, rect, ind, figure) => {
            if (ind !== 0 && figure[ind - 1].data.y !== rect.data.y) {
                return acc + rect.data.size;
            }

            return acc;
        }, 0) + RECT_SIZE;
    }

    get weight() {
        return this._data.at(-1)?.data.x ?? 0 + RECT_SIZE;
    }

    private _generateRandomIntMultipleRectSize = () => {
        const max = (FIELD_SIZE.W / RECT_SIZE) + 1;

        return RECT_SIZE * getRandomInt(max);
    }

    private _makeRandomFigure = () => {
        const randomNum = this._generateRandomIntMultipleRectSize();
        this._data = [new Rect(randomNum, 0)];

        for (let i = 1; i < RECT_COUNT; i++) {
          const randomNum = getRandomInt(2);

          const prevRect = this._data[i - 1];
      
          if (randomNum === 0) this._data.push(new Rect(prevRect.data.x + RECT_SIZE, prevRect.data.y));
          if (randomNum === 1) this._data.push(new Rect(prevRect.data.x, prevRect.data.y + RECT_SIZE));
        }
    }
}