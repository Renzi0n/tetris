import { MAX_LEVEL } from "../../common";
import { Component } from "../Component";

export class ButtonLevel extends Component {
    constructor() {
        super();

        this.getElement().addEventListener('click', this._listener);
    }

    startLevel = 1; 

    private _listener = () => {
        if (this.startLevel === MAX_LEVEL) this.startLevel = 1;
        else this.startLevel += 1;
        this.updateLevel();
    }

    updateLevel() {
        this.getElement().querySelector("#level-btn")!.textContent = String(this.startLevel);
    }

    getTemplate(): string {
        return `
            <button class="btn btn-info mt-4" style="width: 300px; box-shadow: 0 0 20px #00000070;" type="button" id="start">LEVEL: <span id="level-btn">${this.startLevel}</span></button>
        `
    }

    protected removeListeners() {
        this.getElement().removeEventListener('click', this._listener);
    }
}