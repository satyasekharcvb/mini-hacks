import { LightningElement, api } from 'lwc';

export default class Content extends LightningElement {
    @api heading;
    @api subHeading;
}
