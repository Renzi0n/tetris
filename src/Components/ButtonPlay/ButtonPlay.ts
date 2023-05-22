import { Component } from "../Component";

export class ButtonPlay extends Component {
    constructor(private _listener: () => void) {
        super();

        this.getElement().addEventListener('click', this._listener);
    }

    getTemplate(): string {
        return `
            <button class="btn btn-warning" style="width: 300px; box-shadow: 0 0 20px #00000070;" type="button" id="start">PLAY</button>
        `
    }

    protected removeListeners() {
        this.getElement().removeEventListener('click', this._listener);
    }
}