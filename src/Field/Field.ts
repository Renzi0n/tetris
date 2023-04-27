import { FIELD, FIGURES } from "../common";
import { getRandomIntFromRange, getRandomInt } from "../common";
import { Rect } from "../Rect";

type direction = 'default' | 'left' | 'right' | 'down';
type directionsMap =  Record<direction, (rect: Rect) => { xInd: number; yInd: number; }>;

export class Field {
    constructor() {
        this._data = new Array(FIELD.H / FIELD.RECT_SIZE).fill(0).map((_, yInd) => (new Array(FIELD.W / FIELD.RECT_SIZE).fill(0).map((_, xInd) => new Rect(xInd * FIELD.RECT_SIZE, yInd * FIELD.RECT_SIZE))));
        this.generateFigure();
    }

    private _data: Rect[][] = [];

    get data() {
        return this._data;
    }

    getCell = (x: number, y: number): Rect | null => {
        const yInd = (y / FIELD.RECT_SIZE);
        const xInd = (x / FIELD.RECT_SIZE);
        if (yInd < this._data.length && xInd < this._data[0].length && this._data[yInd]) {
            return this._data[yInd][xInd];
        }

        return null;
    }

    getCoordsFromIndexes = (xInd: number, yInd: number) => {
        if (yInd < this._data.length && xInd < this._data[0].length && this._data[yInd]) {
            return {
                y: yInd * FIELD.RECT_SIZE,
                x: xInd * FIELD.RECT_SIZE
            }
        }

        return null;
    }

    get activeRects() {
        return this._data.reduce((acc, line) => {
            line.map((rect) => {
                if (rect.active) {
                    acc.push(rect);
                }
            })

            return acc;
        }, [] as Rect[])
    }

    get filledRects() {
        return this._data.reduce((acc, line) => {
            line.map((rect) => {
                if (rect.filled) {
                    acc.push(rect);
                }
            })

            return acc;
        }, [] as Rect[])
    }

    generatingFigureMap = {
        [FIGURES.J]: () => {
            const firstRectX = getRandomIntFromRange(1, this._data[0].length - 1);
            this._data[0][firstRectX].activate(FIGURES.J);

            const secondRect = this._data[1][firstRectX];
            secondRect.activate(FIGURES.J);

            const thirdRect = this._data[2][firstRectX];
            thirdRect.activate(FIGURES.J);

            const fourthRect = this._data[2][firstRectX - 1];
            fourthRect.activate(FIGURES.J);
        },
        [FIGURES.I]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 1);
            this._data[0][firstRectX].activate(FIGURES.I);

            const secondRect = this._data[1][firstRectX];
            secondRect.activate(FIGURES.I);

            const thirdRect = this._data[2][firstRectX];
            thirdRect.activate(FIGURES.I);

            const fourthRect = this._data[3][firstRectX];
            fourthRect.activate(FIGURES.I);
        },
        [FIGURES.O]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 2);
            this._data[0][firstRectX].activate(FIGURES.O);

            const secondRect = this._data[0][firstRectX + 1];
            secondRect.activate(FIGURES.O);

            const thirdRect = this._data[1][firstRectX];
            thirdRect.activate(FIGURES.O);

            const fourthRect = this._data[1][firstRectX + 1];
            fourthRect.activate(FIGURES.O);
        },
        [FIGURES.L]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 2);
            this._data[0][firstRectX].activate(FIGURES.L);

            const secondRect = this._data[1][firstRectX];
            secondRect.activate(FIGURES.L);

            const thirdRect = this._data[2][firstRectX];
            thirdRect.activate(FIGURES.L);

            const fourthRect = this._data[2][firstRectX + 1];
            fourthRect.activate(FIGURES.L);
        },
        [FIGURES.Z]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 3);
            this._data[0][firstRectX].activate(FIGURES.Z);

            const secondRect = this._data[0][firstRectX + 1];
            secondRect.activate(FIGURES.Z);

            const thirdRect = this._data[1][firstRectX + 1];
            thirdRect.activate(FIGURES.Z);

            const fourthRect = this._data[1][firstRectX + 2];
            fourthRect.activate(FIGURES.Z);
        },
        [FIGURES.T]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 3);
            this._data[1][firstRectX].activate(FIGURES.T);

            const secondRect = this._data[1][firstRectX + 1];
            secondRect.activate(FIGURES.T);

            const thirdRect = this._data[0][firstRectX + 1];
            thirdRect.activate(FIGURES.T);

            const fourthRect = this._data[1][firstRectX + 2];
            fourthRect.activate(FIGURES.T);
        },
        [FIGURES.S]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 3);
            this._data[1][firstRectX].activate(FIGURES.S);

            const secondRect = this._data[1][firstRectX + 1];
            secondRect.activate(FIGURES.S);

            const thirdRect = this._data[0][firstRectX + 1];
            thirdRect.activate(FIGURES.S);

            const fourthRect = this._data[0][firstRectX + 2];
            fourthRect.activate(FIGURES.S);
        },
    };

    generateFigure = () => {
        const randomFigureKey = getRandomInt(Object.keys(this.generatingFigureMap)) as keyof typeof this.generatingFigureMap;
        const applyFigure = this.generatingFigureMap[randomFigureKey];
        applyFigure();
    }

    directionsMap: directionsMap = {
        'default': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE) + 1,
            xInd: (rect.data.x / FIELD.RECT_SIZE)
        }),
        'left': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE),
            xInd: (rect.data.x / FIELD.RECT_SIZE) - 1
        }),
        'right': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE),
            xInd: (rect.data.x / FIELD.RECT_SIZE) + 1
        }),
        'down': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE) + 1,
            xInd: (rect.data.x / FIELD.RECT_SIZE)
        }),
    }

    dropFilledLines = () => {
        let filledLinesIndexes: number[] = [];
        this.data.forEach((line, yInd) => { 
            if (line.every((rect) => rect.filled)) filledLinesIndexes.push(yInd);
        })

        if (filledLinesIndexes.length > 0) {
            filledLinesIndexes.forEach((filledLineIndex) => {
                this._data.splice(filledLineIndex, 1);
                this._data.forEach((line, lineIndex) => {
                    if (lineIndex < filledLineIndex) line.forEach((rect) => rect.y += FIELD.RECT_SIZE)
                })
                this._data.unshift(new Array(FIELD.W / FIELD.RECT_SIZE).fill(0).map((_, xInd) => new Rect(xInd * FIELD.RECT_SIZE, 0)))
            })
        }
    }

    stopActiveFigure = () => {
        this.activeRects.forEach((rect) => rect.disactivate());
        this.dropFilledLines();
        this.generateFigure();
    }

    moveActiveFigure = (direction: direction) => {
        const isAllow = this.activeRects.every((rect) => {
            const { yInd, xInd } = this.directionsMap[direction](rect);
            if (yInd < this.data.length && xInd >= 0 && xInd < this.data[0].length && this.data[yInd]){
                return (this.data[yInd][xInd].filled && this.data[yInd][xInd].active) || !this.data[yInd][xInd].filled;
            }

            return false;
        });

        if (isAllow) {
            const prevColor = this.activeRects[0].color;
            const prevRects = this.activeRects.map(rect => {
                rect.off();
                return rect;
            });

            prevRects.forEach((rect) => {
                const { yInd, xInd } = this.directionsMap[direction](rect);
                this._data[yInd][xInd].activate(prevColor);
            });
        } else if (direction === 'down' || direction === 'default') {
            this.stopActiveFigure();
        }
    }



    checkRotateAllowing = (coords: { xInd: number, yInd: number }[]) => {
        return coords.every(({ xInd, yInd }) => {
            if (yInd < this.data.length && xInd >= 0 && xInd < this.data[0].length && this.data[yInd]){
                return (this.data[yInd][xInd].filled && this.data[yInd][xInd].active) || !this.data[yInd][xInd].filled;
            }

            return false;
        })
    }

    rotateActiveFigure = () => {
        const oldX1 = this.activeRects[0].x;
        const oldY1 = this.activeRects[0].y;
        const oldX2 = this.activeRects[1].x;
        const oldY2 = this.activeRects[1].y;
        const oldX3 = this.activeRects[2].x;
        const oldY3 = this.activeRects[2].y;
        const oldX4 = this.activeRects[3].x;
        const oldY4 = this.activeRects[3].y;
        const oldColor = this.activeRects[0].color;
      
        const centerX = Math.floor((oldX1 + oldX2 + oldX3 + oldX4) / 4 / FIELD.RECT_SIZE) * FIELD.RECT_SIZE + (FIELD.RECT_SIZE / 2);
        const centerY = Math.floor((oldY1 + oldY2 + oldY3 + oldY4) / 4 / FIELD.RECT_SIZE) * FIELD.RECT_SIZE + (FIELD.RECT_SIZE / 2);

        let newCoords = [
            {
                xInd: (centerX + (oldY1 - centerY)) / FIELD.RECT_SIZE,
                yInd: (centerY - (oldX1 - centerX)) / FIELD.RECT_SIZE
            },
            {
                xInd: (centerX + (oldY2 - centerY)) / FIELD.RECT_SIZE,
                yInd: (centerY - (oldX2 - centerX)) / FIELD.RECT_SIZE
            },
            {
                xInd: (centerX + (oldY3 - centerY)) / FIELD.RECT_SIZE,
                yInd: (centerY - (oldX3 - centerX)) / FIELD.RECT_SIZE
            },
            {
                xInd: (centerX + (oldY4 - centerY)) / FIELD.RECT_SIZE,
                yInd: (centerY - (oldX4 - centerX)) / FIELD.RECT_SIZE
            },
        ]

        const isRotatingAllow = this.checkRotateAllowing(newCoords);
        
        if (isRotatingAllow) {
            this.activeRects.map(rect => {
                rect.off();
                return rect;
            });
            this.data[newCoords[0].yInd][newCoords[0].xInd].activate(oldColor);
            this.data[newCoords[1].yInd][newCoords[1].xInd].activate(oldColor);
            this.data[newCoords[2].yInd][newCoords[2].xInd].activate(oldColor);
            this.data[newCoords[3].yInd][newCoords[3].xInd].activate(oldColor);
        } else {
            newCoords = newCoords.map(({ xInd, yInd }) => ({
                xInd: xInd + 1,
                yInd
            }))
            const isRotatingAllow = this.checkRotateAllowing(newCoords);
            if (isRotatingAllow) {
                this.activeRects.map(rect => {
                    rect.off();
                    return rect;
                });
                this.data[newCoords[0].yInd][newCoords[0].xInd].activate(oldColor);
                this.data[newCoords[1].yInd][newCoords[1].xInd].activate(oldColor);
                this.data[newCoords[2].yInd][newCoords[2].xInd].activate(oldColor);
                this.data[newCoords[3].yInd][newCoords[3].xInd].activate(oldColor);
            }
        }
    }
}