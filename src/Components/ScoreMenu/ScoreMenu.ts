import { FIELD, ScoreData } from "../../common";
import { Component } from "../Component";

export class ScoreMenu extends Component {
    constructor() {
        super();
    }

    updateScore(scoreData: ScoreData) {
        this.getElement().querySelector("#score")!.textContent = String(scoreData.score);
        this.getElement().querySelector("#lines")!.textContent = String(scoreData.lines);
        this.getElement().querySelector("#level")!.textContent = String(scoreData.level);
    }

    getTemplate(): string {
        return `
            <div style="border: 3px solid black; box-shadow: 0px 0px 20px #949494; border-radius: 5px; position: absolute; width: 180px; padding: 10px; top: calc(20vh - 138px); left: calc(50vw - (${FIELD.W}px + 20px)) ">
                <h2 style="text-align: center; margin-bottom: 2px;">SCORE</h2>
                <div id="score" style="border: 3px solid black;
                        box-shadow: 0px 0px 6px inset #949494;
                        border-radius: 5px;
                        width: 100px;
                        height: 38px;
                        margin: auto;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;">
                        0
                </div>
                <h2 style="text-align: center; margin-top: 10px; margin-bottom: 2px;">LEVEL</h2>
                <div id="level" style="border: 3px solid black;
                        box-shadow: 0px 0px 6px inset #949494;
                        border-radius: 5px;
                        width: 100px;
                        height: 38px;
                        margin: auto;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;">0
                </div>
                <h2 style="text-align: center; margin-top: 10px; margin-bottom: 2px;">LINES</h2>
                <div id="lines" style="border: 3px solid black;
                        box-shadow: 0px 0px 6px inset #949494;
                        border-radius: 5px;
                        width: 100px;
                        height: 38px;
                        margin: auto;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;">
                        0
                </div>
            </div>
        `
    }
}