import { LightningElement, api, track } from 'lwc';
import { getData } from 'utils/fetchUtils';
export default class LwcContent extends LightningElement {
    @api attendeeId;
    @api attendeeName;
    @api hackId;
    @api attendeeCode;

    @track hacks;
    checked;
    checked1;
    checked2;

    _attendeeObj;

    get attendeeObj() {
        return this._attendeeObj;
    }

    @api
    set attendeeObj(val) {
        this._attendeeObj = val;
        this.populateHackStatus();
    }

    populateHackStatus() {
        this.hacks = {
            hack7: {
                started: this._attendeeObj.Challenge_7_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_7_completed__c
                    ? true
                    : false
            }
        };
    }

    startHack(e) {
        const hackId = e.target.dataset.hackid;
        this.hacks['hack' + hackId].started = true;

        getData('https://sf-mini-hacks.herokuapp.com/api/start', {
            attendeeId: this.attendeeId,
            hackNumber: hackId
        })
            .then(() => {
                console.log('Started Hack');
            })
            .catch(() => {
                console.log('Error starting Hack');
            });
    }

    completeHack(e) {
        this.hacks['hack' + e.detail.hackNumber].completed = true;
    }

    changeToggle(event) {
        this.checked = true;
        event.target.label == "I'm new to Mulesoft"
            ? ((this.checked1 = true), (this.checked2 = false))
            : ((this.checked1 = false), (this.checked2 = true));
        setTimeout(() => {
            this.template
                .querySelector('.showhack')
                .scrollIntoView({ behavior: 'smooth', alignToTop: true });
        }, 100);
    }

    get b1Variant() {
        return this.checked1 ? 'brand' : 'neutral';
    }

    get b2Variant() {
        return this.checked2 ? 'brand' : 'neutral';
    }
}
