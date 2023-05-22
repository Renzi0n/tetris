import { Component } from "../Component";

export class ScoreRecords extends Component {
    constructor(private _records: [number, number, number, number]) {
        super();
    }

    getTemplate(): string {
        const [first, second, third, fourth] = this._records;

        return `
            <div class="card" style="width: 180px; background: white;
            box-shadow: inset 0px 0px 20px 0px #048de4a3;
            border: 1px solid #de00af; position: absolute; right: 20px; top: 20px;">
                <div class="card-body">
                <h5 class="card-title" style="text-align: center;">HIGHT SCORES</h5>
                <div style="display: flex; flex-direction: column; align-items: center; justify-self: center;">
                    <span class="badge bg-primary" style="width: 130px;">${first}</span>
                    <span class="badge bg-warning mt-2" style="width: 130px;">${second}</span>
                    <span class="badge bg-success mt-2" style="width: 130px;">${third}</span>
                    <span class="badge bg-dark mt-2" style="width: 130px;">${fourth}</span>
                </div>
                </div>
            </div>
        `
    }
}