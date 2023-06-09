import { FIELD, FIGURES } from "../common";
import { getRandomIntFromRange, getRandomInt } from "../common";
import { Rect } from "../Rect";

type direction = 'default' | 'left' | 'right' | 'down' | 'immediately-down';
type directionsMap =  Record<direction, (rect: Rect) => { xInd: number; yInd: number; }>;

const SCORES_FOR_LINES = [100, 300, 700, 1500];

export class Field {
    constructor(startLevel: number) {
        this._data = new Array(FIELD.H / FIELD.RECT_SIZE).fill(0).map((_, yInd) => (new Array(FIELD.W / FIELD.RECT_SIZE).fill(0).map((_, xInd) => new Rect(xInd * FIELD.RECT_SIZE, yInd * FIELD.RECT_SIZE))));
        this.generateFigure();
        this.level = startLevel;
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

    get activeRectsProjection() {
        let maxActiveEls: Rect[] = [];
        let maxActiveY = 0;
        this.activeRects.forEach((active) => active.y > maxActiveY ? maxActiveY = active.y : maxActiveY);
        this.activeRects.forEach((active) => !this.data[active.y / FIELD.RECT_SIZE + 1] || !this.data[active.y / FIELD.RECT_SIZE + 1][active.x / FIELD.RECT_SIZE].active ? maxActiveEls.push(active) : maxActiveEls);
        let activeRect: Rect = this.activeRects.find((act) => act.y === maxActiveY) as Rect;
        let highestFilledRect: Rect | undefined = this.onlyFilledRects.find((fill) => fill.x === activeRect.x);
        this.onlyFilledRects.forEach((filled) => {
            let maxY = highestFilledRect ? highestFilledRect.y : FIELD.H + 1;
            maxActiveEls.forEach((act) => {
                if ((act.x === filled.x && filled.y < maxY)) {
                    highestFilledRect = filled;
                    activeRect = act;
                };
            })
        });
        return this.activeRects.reduce((acc, rect) => {
            if (highestFilledRect) {
                const projRect = this._data[(highestFilledRect.y / FIELD.RECT_SIZE - (activeRect.y / FIELD.RECT_SIZE - rect.y / FIELD.RECT_SIZE) - 1)][rect.x / FIELD.RECT_SIZE];
                acc.push(new Rect(projRect.x, projRect.y, this.activeRects[0].color));
            } else {
                const projRect = this._data[this.data.length - 1 - (maxActiveY / FIELD.RECT_SIZE - rect.y / FIELD.RECT_SIZE)][rect.x / FIELD.RECT_SIZE];
                acc.push(new Rect(projRect.x, projRect.y, this.activeRects[0].color));
            }

            return acc;
        }, [] as Rect[])
    }

    get onlyFilledRects() {
        return this._data.reduce((acc, line) => {
            line.map((rect) => {
                if (rect.filled && !rect.active) {
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

    isOver = false;

    checkIsOver = (willGeneratedRects: Rect[]) => {
        return willGeneratedRects.some((rect) => {
            return this.filledRects.some((actRect) => rect.x === actRect.x && rect.y === actRect.y);
        });
    }

    generatingFigureMap = {
        [FIGURES.J]: () => {
            const firstRectX = getRandomIntFromRange(1, this._data[0].length - 1);

            const firstRect = this._data[0][firstRectX];
            const secondRect = this._data[1][firstRectX];
            const thirdRect = this._data[2][firstRectX];
            const fourthRect = this._data[2][firstRectX - 1];

            return [firstRect, secondRect, thirdRect, fourthRect];
        },
        [FIGURES.I]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 1);

            const firstRect = this._data[0][firstRectX];
            const secondRect = this._data[1][firstRectX];
            const thirdRect = this._data[2][firstRectX];
            const fourthRect = this._data[3][firstRectX];

            return [firstRect, secondRect, thirdRect, fourthRect];
        },
        [FIGURES.O]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 2);

            const firstRect = this._data[0][firstRectX];
            const secondRect = this._data[0][firstRectX + 1];
            const thirdRect = this._data[1][firstRectX];
            const fourthRect = this._data[1][firstRectX + 1];

            return [firstRect, secondRect, thirdRect, fourthRect];
        },
        [FIGURES.L]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 2);

            const firstRect = this._data[0][firstRectX];
            const secondRect = this._data[1][firstRectX];
            const thirdRect = this._data[2][firstRectX];
            const fourthRect = this._data[2][firstRectX + 1];

            return [firstRect, secondRect, thirdRect, fourthRect];
        },
        [FIGURES.Z]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 3);

            const firstRect = this._data[0][firstRectX];
            const secondRect = this._data[0][firstRectX + 1];
            const thirdRect = this._data[1][firstRectX + 1];
            const fourthRect = this._data[1][firstRectX + 2];

            return [firstRect, secondRect, thirdRect, fourthRect];
        },
        [FIGURES.T]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 3);

            const firstRect = this._data[1][firstRectX];
            const secondRect = this._data[1][firstRectX + 1];
            const thirdRect = this._data[0][firstRectX + 1];
            const fourthRect = this._data[1][firstRectX + 2];

            return [firstRect, secondRect, thirdRect, fourthRect];
        },
        [FIGURES.S]: () => {
            const firstRectX = getRandomIntFromRange(0, this._data[0].length - 3);

            const firstRect = this._data[1][firstRectX];
            const secondRect = this._data[1][firstRectX + 1];
            const thirdRect = this._data[0][firstRectX + 1];
            const fourthRect = this._data[0][firstRectX + 2];

            return [firstRect, secondRect, thirdRect, fourthRect];
        },
    };

    generateFigure = () => {
        const randomFigureKey = getRandomInt(Object.keys(this.generatingFigureMap)) as keyof typeof this.generatingFigureMap;
        const applyFigure = this.generatingFigureMap[randomFigureKey];
        const figure = applyFigure();
            
        this.isOver = this.checkIsOver(figure);
        if (!this.isOver) figure.forEach(rect => rect.activate(randomFigureKey));
    }

    score = 0;

    lines = 0;

    nextLevelLines = 10;

    level = 10;

    get maxFilledYInd() {
        return this.filledRects
    }

    directionsMap: directionsMap = {
        'default': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE) + 1,
            xInd: (rect.x / FIELD.RECT_SIZE)
        }),
        'left': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE),
            xInd: (rect.x / FIELD.RECT_SIZE) - 1
        }),
        'right': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE),
            xInd: (rect.x / FIELD.RECT_SIZE) + 1
        }),
        'down': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE) + 1,
            xInd: (rect.x / FIELD.RECT_SIZE)
        }),
        'immediately-down': (rect: Rect) => ({
            yInd: (rect.y / FIELD.RECT_SIZE) + 1,
            xInd: (rect.x / FIELD.RECT_SIZE)
        }),
    }

    dropFilledLines = () => {
        let filledLinesIndexes: number[] = [];
        this.data.forEach((line, yInd) => { 
            if (line.every((rect) => rect.filled)) filledLinesIndexes.push(yInd);
        })

        const filledLinesCount = filledLinesIndexes.length;

        if (filledLinesCount > 0) {
            this.lines += filledLinesCount;
            if (SCORES_FOR_LINES[filledLinesCount - 1]) this.score += SCORES_FOR_LINES[filledLinesCount - 1];
            else this.score += SCORES_FOR_LINES.at(-1)!;

            if (this.lines >= this.nextLevelLines) {
                this.level += 1;
                this.nextLevelLines = this.nextLevelLines + 10;
            }

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

    isImmediatelyDown = false;

    moveActiveFigure = (direction: direction) => {
        if (direction === 'immediately-down') this.isImmediatelyDown = true;
        if (this.isImmediatelyDown) direction = 'immediately-down';
        console.log(direction)

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
            if (direction === 'down') this.score += 1;
            else if (direction === 'immediately-down') this.score += 2;

            prevRects.forEach((rect) => {
                const { yInd, xInd } = this.directionsMap[direction](rect);

                this._data[yInd][xInd].activate(prevColor);
            });
        } else if (direction === 'down' || direction === 'immediately-down' || direction === 'default') {
            this.isImmediatelyDown = false;
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

    tryRotate = (newCoords: { xInd: number; yInd: number; }[]) => {
        const oldColor = this.activeRects[0].color;
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

        return isRotatingAllow;
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

        const isRotatingAllow = this.tryRotate(newCoords);
        
        if (!isRotatingAllow) {
            newCoords = newCoords.map(({ xInd, yInd }) => ({
                xInd: xInd + 1,
                yInd
            }))
            const isRotatingAllow = this.tryRotate(newCoords);
            if (!isRotatingAllow) {
                newCoords = newCoords.map(({ xInd, yInd }) => ({
                    xInd: xInd - 3,
                    yInd
                }))
                this.tryRotate(newCoords);
            }
        }
    }
}