import { Component } from "../Component";

export class ButtonsWrapper extends Component {
    constructor() {
        super();
    }

    getTemplate(): string {
        return `
            <div class="mt-4" style="display: flex; flex-direction: column;">
            </div>
        `
    }
}