import { FIELD } from "../../common";
import { Component } from "../Component";

export class CanvasField extends Component<HTMLCanvasElement> {
    constructor() {
        super();
        const canv = this.getElement() as HTMLCanvasElement;

        canv.width = FIELD.W;
        canv.height = FIELD.H;
        canv.style.background = FIELD.COLOR;
    }

    getTemplate(): string {
        return `
            <canvas id="canvas" style="border: 3px solid black; box-shadow: 0px 0px 20px #949494; border-radius: 5px; display: block; margin: auto;"></canvas>
        `
    }
}