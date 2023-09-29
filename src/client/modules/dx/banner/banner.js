import { LightningElement, api } from 'lwc';

export default class Banner extends LightningElement {
    @api heading;
    @api subHeading;
}
