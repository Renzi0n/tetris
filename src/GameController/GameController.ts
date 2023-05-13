import { Game } from "../Game";
const modal = document.querySelector('#pause-menu') as HTMLElement;
const closeModalBtn = document.querySelector('#close-pause-menu') as HTMLElement;
const start = document.querySelector('#start') as HTMLElement;
const restart = document.querySelector('#restart') as HTMLElement;
const pause = document.querySelector('#pause') as HTMLElement;

export class GameController {
    constructor() {
        document.addEventListener('keydown', this.onKeydownStart)
        document.addEventListener('keydown', this.onKeydownRestart)
        start.addEventListener('click', this.start)
        restart.addEventListener('click', this.restart)
    }

    onKeydownStart = (evt: KeyboardEvent) => {
        if (evt.code === 'Space' || 'Enter') this.start();
    }

    onKeydownRestart = (evt: KeyboardEvent) => {
        if (evt.code === 'Backspace') this.restart();
    }

    restart = () => {
        this.game?.stop();
        this.start();
    }

    start = () => {
        document.removeEventListener('keydown', this.onKeydownStart);
        closeModalBtn.addEventListener('click', this.unpause)
        document.addEventListener('keydown', (evt: KeyboardEvent) => {
            if (evt.code === 'Enter') {
                if (!this.isPause) this.pause();
                else this.unpause();
            }
        })
        pause.addEventListener('click', () => {
            if (!this.isPause) this.pause();
        });
        this.game = new Game();
        this.game.start();
    }

    isPause = false;

    pause = () => {
        this.game!.pause();
        this.isPause = true;
        this.openModal();
    }

    unpause = () => {
        this.game!.continue();
        this.isPause = false;
        this.closeModal();
    }

    closeModal() {
        modal.style.display = 'none';
    }

    openModal() {
        modal.style.display = 'block';
    }

    game: Game | null = null;
}