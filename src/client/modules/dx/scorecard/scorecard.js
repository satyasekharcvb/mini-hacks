import { LightningElement, api } from 'lwc';

export default class Card extends LightningElement {
    @api heading;
    @api body;
    @api url;
}
