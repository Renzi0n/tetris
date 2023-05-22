import { render, RenderPosition } from "../../common";
import { ButtonLevel } from "../ButtonLevel";
import { ButtonPlay } from "../ButtonPlay";
import { ButtonsWrapper } from "../ButtonsWrapper";
import { Component } from "../Component";
import { ScoreRecords } from "../ScoreRecords";

export class StartMenu extends Component {
    constructor(private _records: [number, number, number, number], private _playHandler: () => void) {
        super();
        this.render();
    }

    protected getTemplate(): string {
        return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: auto; width: 90vh; height: 80vh; margin-top: calc(50vh - 80vh / 2); background: linear-gradient(135deg, #e55d87 0%, #5fc3e4 100%); border-radius: 5px; position: relative; box-shadow: 0px 0px 20px #949494;">        
                <img src="https://upload.wikimedia.org/wikipedia/en/b/b0/The_Tetris_Company_logo.png" />
            </div>
        `
    }

    private _btnLevel = new ButtonLevel();

    get startLevel() {
        return this._btnLevel.startLevel;
    }

    render() {
        const wrapper = this.getElement();
        const scoreRecords = new ScoreRecords(this._records).getElement();
        const btnsWrapper = new ButtonsWrapper().getElement();
        const btnPlay = new ButtonPlay(this._playHandler).getElement();
        const btnLevel = this._btnLevel.getElement();

        render(wrapper, scoreRecords, RenderPosition.BEFOREEND);
        render(btnsWrapper, btnPlay, RenderPosition.BEFOREEND);
        render(btnsWrapper, btnLevel, RenderPosition.BEFOREEND);
        render(wrapper, btnsWrapper, RenderPosition.BEFOREEND);
    }
}