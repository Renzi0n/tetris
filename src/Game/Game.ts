import { FIELD, FIGURES } from "../common";
import { Field } from "../Field";
import { Rect } from "../Rect";

export class Game {
    constructor() {
        const canv = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = canv.getContext('2d') as CanvasRenderingContext2D;
        
        canv.width = FIELD.W;
        canv.height = FIELD.H;
        canv.style.background = FIELD.COLOR;
    }

    private ctx: CanvasRenderingContext2D;

    private field = new Field();

    private drawNet = () => {
        this.ctx.lineWidth = 1;
        this.field.data[0].forEach((_, ind) => {
            this.ctx.strokeStyle = FIELD.NET_COLOR;
            this.ctx.beginPath();
            this.ctx.moveTo(ind * FIELD.RECT_SIZE, 0);
            this.ctx.lineTo(ind * FIELD.RECT_SIZE, FIELD.H);
            this.ctx.stroke();
            this.ctx.closePath();
        })
        this.field.data.forEach((_, ind) => {
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
    
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(rect.x, rect.y, FIELD.RECT_SIZE, FIELD.RECT_SIZE);
    }

    private defaultTimeDelay = 1000;
    private moveTimeDelay = 100;
    private moveDownTimeDelay = 20;
    private rotateTimeDelay = 200;
    private timerDefault = Date.now();
    private moveActiveFigure = () => {
        if (Date.now() - this.timerDefault > this.defaultTimeDelay) {
            this.field.moveActiveFigure('default');
            this.timerDefault = Date.now();
        }
    }

    private timerLeft = Date.now();
    private moveLeftActiveFigure = () => {
        if (Date.now() - this.timerLeft > this.moveTimeDelay) {
            this.field.moveActiveFigure('left');
            this.timerLeft = Date.now();
        }
    }

    private timerRight = Date.now();
    private moveRightActiveFigure = () => {
        if (Date.now() - this.timerRight > this.moveTimeDelay) {
            this.field.moveActiveFigure('right');
            this.timerRight = Date.now();
        }
    }

    private timerDown = Date.now();
    private moveDownActiveFigure = () => {
        if (Date.now() - this.timerDown > this.moveDownTimeDelay) {
            this.field.moveActiveFigure('down');
            this.timerDown = Date.now();
        }
    }

    private timerRotate = Date.now();
    private rotateActiveFigure = () => {
        if (Date.now() - this.timerRotate > this.rotateTimeDelay) {
            this.field.rotateActiveFigure();
            this.timerRotate = Date.now();
        }
    }

    private render = () => {
        requestAnimationFrame(this.render);
        this.ctx.clearRect(0, 0, FIELD.W, FIELD.H);
        this.drawNet();

        this.moveActiveFigure();

        if (this.keysPressed.has('ArrowLeft')) this.moveLeftActiveFigure();
        if (this.keysPressed.has('ArrowRight')) this.moveRightActiveFigure();
        if (this.keysPressed.has('ArrowDown')) this.moveDownActiveFigure();
        if (this.keysPressed.has('ArrowUp')) this.rotateActiveFigure();

        this.field.filledRects.forEach((rect) => this.generateRect(rect))
    }

    private keysPressed = new Set<string>();

    private linstenerKeydown = (evt: KeyboardEvent) => {
        this.keysPressed.add(evt.code);
    }
    
    private linstenerKeyup = (evt: KeyboardEvent) => {
        this.keysPressed.delete(evt.code);
    }

    start() {
        document.addEventListener('keydown', this.linstenerKeydown)
        document.addEventListener('keyup', this.linstenerKeyup)
        requestAnimationFrame(this.render);
    }
}