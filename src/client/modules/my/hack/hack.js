import { LightningElement, api } from 'lwc';
import HACK from './hack.html';
import HACK1 from './hack1.html';
import HACK2 from './hack2.html';
import HACK3 from './hack3.html';
import HACK4 from './hack4.html';
import HACK5 from './hack5.html';
import HACK6 from './hack6.html';
import HACK7 from './hack7.html';
import HACK8 from './hack8.html';
import HACK9 from './hack9.html';
import HACK10 from './hack10.html';

export default class Hack extends LightningElement {
    @api hackNumber;
    render() {
        if (this.hackNumber === '1') {
            return HACK1;
        } else if (this.hackNumber === '2') {
            return HACK2;
        } else if (this.hackNumber === '3') {
            return HACK3;
        } else if (this.hackNumber === '4') {
            return HACK4;
        } else if (this.hackNumber === '5') {
            return HACK5;
        } else if (this.hackNumber === '6') {
            return HACK6;
        } else if (this.hackNumber === '7') {
            return HACK7;
        } else if (this.hackNumber === '8') {
            return HACK8;
        } else if (this.hackNumber === '9') {
            return HACK9;
        } else if (this.hackNumber === '10') {
            return HACK10;
        } else {
            return HACK;
        }
    }
}
