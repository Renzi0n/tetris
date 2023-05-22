import { Game } from "../Game";
import { CanvasField, Pause, StartMenu } from "../Components";
import { render, RenderPosition, ScoreData } from "../common";
import { ScoreMenu } from "../Components/ScoreMenu";

export class GameController {
    constructor() {
        document.addEventListener('keydown', this._onEnterKeydown)
        this._startMenu = new StartMenu([2000, 1123, 1001, 332], this._start);
        render(document.querySelector('#start-menu'), this._startMenu.getElement(), RenderPosition.AFTERBEGIN);
    }

    private _startMenu: StartMenu | null = null;

    private _canvasField: CanvasField | null = null;

    private _scoreMenu: ScoreMenu | null = null;

    private _game: Game | null = null;

    private _onEnterKeydown = (evt: KeyboardEvent) => {
        if (evt.code === 'Enter') this._start(); 
    }

    private _isPaused = false;

    private _pause: Pause | null = null;

    private _start = () => {
        this._startMenu?.removeElement();
        document.removeEventListener('keydown', this._onEnterKeydown)

        this._canvasField = new CanvasField();
        render(document.querySelector('#game'), this._canvasField.getElement(), RenderPosition.AFTERBEGIN);

        this._game = new Game(this._startMenu!.startLevel, this._canvasField?.getElement(), this._updateScore.bind(this));
        this._game!.start();

        this._scoreMenu = new ScoreMenu();
        render(document.querySelector('#game'), this._scoreMenu.getElement(), RenderPosition.AFTERBEGIN);

        document.addEventListener('keydown', (evt) => {
            if (evt.code === 'Escape' && !this._isPaused) {
                this._game?.pause();

                this._pause = new Pause(() => {});
                render(document.querySelector('body'), this._pause.getElement(), RenderPosition.AFTERBEGIN);

                this._isPaused = true;
            } else if (evt.code === 'Escape' && this._isPaused) {
                this._game?.continue();

                this._pause?.removeElement();

                this._isPaused = false;
            }
        })
    }

    private _updateScore(scoreData: ScoreData) {
        this._scoreMenu?.updateScore(scoreData);
    }
}