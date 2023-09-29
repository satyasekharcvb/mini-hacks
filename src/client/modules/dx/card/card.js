import { LightningElement, api } from 'lwc';

export default class Card extends LightningElement {
    @api heading;
    @api body;
    @api url;
    @api started;

    get flipContainerClass() {
        return this.started === true
            ? 'flip-container hover'
            : 'flip-container';
    }
}
