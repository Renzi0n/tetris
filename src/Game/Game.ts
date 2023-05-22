import { FIELD, FIGURES, ScoreData } from "../common";
import { Field } from "../Field";
import { Rect } from "../Rect";

export class Game {
    constructor(startLevel: number, canv?: HTMLCanvasElement, private _updateScore?: (scoreData: ScoreData) => void) {
        if (!canv) throw new Error('Canvas not implemented!');

        this.ctx = canv.getContext('2d') as CanvasRenderingContext2D;
        this.field = new Field(startLevel);
    }

    private ctx: CanvasRenderingContext2D;

    private field: Field | null = null;

    private drawNet = () => {
        this.ctx.lineWidth = 1;
        this.field!.data[0].forEach((_, ind) => {
            this.ctx.strokeStyle = FIELD.NET_COLOR;
            this.ctx.beginPath();
            this.ctx.moveTo(ind * FIELD.RECT_SIZE, 0);
            this.ctx.lineTo(ind * FIELD.RECT_SIZE, FIELD.H);
            this.ctx.stroke();
            this.ctx.closePath();
        })
        this.field!.data.forEach((_, ind) => {
            this.ctx.strokeStyle = FIELD.NET_COLOR;
            this.ctx.beginPath();
            this.ctx.moveTo(0, ind * FIELD.RECT_SIZE);
            this.ctx.lineTo(FIELD.W, ind * FIELD.RECT_SIZE);
            this.ctx.stroke();
            this.ctx.closePath();
        })
    }
    
    private generateRect = (rect: Rect) => {
        this.ctx.fillStyle = rect.color ?? FIGURES.I;
        this.ctx.fillRect(rect.x, rect.y, FIELD.RECT_SIZE, FIELD.RECT_SIZE);

        // Add a shadow
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.fillRect(rect.x + 5, rect.y + 5, FIELD.RECT_SIZE - 10, FIELD.RECT_SIZE - 10);
        // Add a shadow
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.fillRect(rect.x + 12.5, rect.y + 12.5, FIELD.RECT_SIZE - 25, FIELD.RECT_SIZE - 25);
        // Add a shadow
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.fillRect(rect.x + 17.5, rect.y + 17.5, FIELD.RECT_SIZE - 35, FIELD.RECT_SIZE - 35);

        // Draw the border
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(rect.x, rect.y, FIELD.RECT_SIZE, FIELD.RECT_SIZE);
    }
    
    private generateProjection = (rect: Rect) => {
        this.ctx.save();
        this.ctx.globalAlpha = 0.4;
        this.ctx.fillStyle = rect.color ?? FIGURES.I;
        this.ctx.fillRect(rect.x, rect.y, FIELD.RECT_SIZE, FIELD.RECT_SIZE);

        // Add a shadow
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.fillRect(rect.x + 5, rect.y + 5, FIELD.RECT_SIZE - 10, FIELD.RECT_SIZE - 10);
        // Add a shadow
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.fillRect(rect.x + 12.5, rect.y + 12.5, FIELD.RECT_SIZE - 25, FIELD.RECT_SIZE - 25);
        // Add a shadow
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        this.ctx.fillRect(rect.x + 17.5, rect.y + 17.5, FIELD.RECT_SIZE - 35, FIELD.RECT_SIZE - 35);
        this.ctx.setLineDash([6]);
        this.ctx.strokeRect(rect.x, rect.y, FIELD.RECT_SIZE, FIELD.RECT_SIZE);
        this.ctx.setLineDash([0]);
        this.ctx.restore();
    }

    get moveSpeedMs() {
        return ((11 - this.field!.level) * 0.05) * 1000;
    }

    private moveTimeDelay = 100;
    private moveDownTimeDelay = 40;
    private rotateTimeDelay = 200;
    private timerDefault = Date.now();
    private moveActiveFigure = () => {
        if (Date.now() - this.timerDefault > this.moveSpeedMs) {
            this.field!.moveActiveFigure('default');
            this.timerDefault = Date.now();
        }
    }

    private timerLeft = Date.now();
    private moveLeftActiveFigure = () => {
        if (Date.now() - this.timerLeft > this.moveTimeDelay) {
            this.field!.moveActiveFigure('left');
            this.timerLeft = Date.now();
        }
    }

    private timerRight = Date.now();
    private moveRightActiveFigure = () => {
        if (Date.now() - this.timerRight > this.moveTimeDelay) {
            this.field!.moveActiveFigure('right');
            this.timerRight = Date.now();
        }
    }

    private timerDown = Date.now();
    private moveDownActiveFigure = () => {
        if (Date.now() - this.timerDown > this.moveDownTimeDelay) {
            this.field!.moveActiveFigure('down');
            this.timerDown = Date.now();
        }
    }

    private timerRotate = Date.now();
    private rotateActiveFigure = () => {
        if (Date.now() - this.timerRotate > this.rotateTimeDelay) {
            this.field!.rotateActiveFigure();
            this.timerRotate = Date.now();
        }
    }

    private moveDownActiveFigureImmediately = () => {
        this.field!.moveActiveFigure('immediately-down')
    }

    private render = () => {
        this.requestId = requestAnimationFrame(this.render);
        this.ctx.clearRect(0, 0, FIELD.W, FIELD.H);
        this.drawNet();
        if (!this.field?.isOver) {
            this.moveActiveFigure();
    
            if (this.keysPressed.has('ArrowLeft')) this.moveLeftActiveFigure();
            if (this.keysPressed.has('ArrowRight')) this.moveRightActiveFigure();
            if (this.keysPressed.has('ArrowDown')) this.moveDownActiveFigure();
            if (this.keysPressed.has('ArrowUp')) this.rotateActiveFigure();
            if (this.keysPressed.has('Space') || this.field?.isImmediatelyDown) {
                this.moveDownActiveFigureImmediately();
                if (!this.field?.isImmediatelyDown) this.keysPressed.delete('Space');
            }
            
            if (this._updateScore) this._updateScore({
                score: this.field!.score,
                level: this.field!.level,
                lines: this.field!.lines
            });
    
            this.field!.filledRects.forEach((rect) => this.generateRect(rect));
            this.field!.activeRectsProjection.forEach((rect) => this.generateProjection(rect));
        } else {
            this.stop();
        }

    }

    private keysPressed = new Set<string>();

    private linstenerKeydown = (evt: KeyboardEvent) => {
        this.keysPressed.add(evt.code);
    }
    
    private linstenerKeyup = (evt: KeyboardEvent) => {
        this.keysPressed.delete(evt.code);
    }

    requestId: number | null = null;

    start() {
        document.addEventListener('keydown', this.linstenerKeydown)
        document.addEventListener('keyup', this.linstenerKeyup)
        requestAnimationFrame(this.render);
    }

    stop = () => {
        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
            document.removeEventListener('keydown', this.linstenerKeydown)
            document.removeEventListener('keyup', this.linstenerKeyup)
            this.field = null as unknown as Field;
        } 
    }

    pause = () => {
        if (this.requestId !== null) {
            cancelAnimationFrame(this.requestId);
        } 
    }

    continue = () => {
        if (this.requestId !== null) {
            requestAnimationFrame(this.render);
        }
    }
}