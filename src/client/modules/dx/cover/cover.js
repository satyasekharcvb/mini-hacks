import { LightningElement, api } from 'lwc';

export default class Cover extends LightningElement {
    @api heading;
    @api subHeading;
    @api eventDate;
    @api body;
}
