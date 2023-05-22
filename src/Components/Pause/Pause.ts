import { Component } from "../Component";

export class Pause extends Component {
    constructor(pauseHandler: () => void) {
        super();
        this.getElement().querySelector("#pause")?.addEventListener('click', pauseHandler);
    }

    getTemplate(): string {
        return `
            <div style="position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.3)">
                <a id="pause">
                    <img style="position: absolute; left: 40vw; top: 30vh; width: 20vw; height: 40vh;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/OOjs_UI_icon_pause.svg/1024px-OOjs_UI_icon_pause.svg.png" />
                </a>
            </div>
        `
    }
}