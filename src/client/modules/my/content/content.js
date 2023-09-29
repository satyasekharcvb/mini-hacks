import { LightningElement, api, track } from 'lwc';
import { getData } from 'utils/fetchUtils';

export default class Content extends LightningElement {
    @api attendeeId;
    @api attendeeName;
    @api hackId;
    @api attendeeCode;

    @track hacks;
    checked;
    checked1;
    checked2;

    _attendeeObj;

    showContent;
    showLWCContent;
    showCLIContent;
    showSlackContent;
    showTableauContent;
    showMulesoftContent;
    showFlowContent;
    showMegaHackContent;
    showVonageContent;

    handleContent(event) {
        this.showContent = true;
        this.clear();
        this.showLWCContent = event.detail.showLWC;
        this.showCLIContent = event.detail.showCLI;
        this.showSlackContent = event.detail.showSlack;
        this.showTableauContent = event.detail.showTableau;
        this.showMulesoftContent = event.detail.showMulesoft;
        this.showFlowContent = event.detail.showFlow;
        this.showMegaHackContent = event.detail.showMegaHack;
        this.showVonageContent = event.detail.showVonage;
        const init = event.detail.init;
        if (!init) {
            setTimeout(() => {
                this.template.querySelector('.welcome').scrollIntoView({
                    behavior: 'smooth',
                    alignToBottom: true
                });
            }, 100);
        }
    }

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
            hack1: {
                started: this._attendeeObj.Challenge_1_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_1_completed__c
                    ? true
                    : false
            },
            hack2: {
                started: this._attendeeObj.Challenge_2_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_2_completed__c
                    ? true
                    : false
            },
            hack3: {
                started: this._attendeeObj.Challenge_3_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_3_completed__c
                    ? true
                    : false
            },
            hack4: {
                started: this._attendeeObj.Challenge_4_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_4_completed__c
                    ? true
                    : false
            },
            hack5: {
                started: this._attendeeObj.Challenge_5_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_5_completed__c
                    ? true
                    : false
            },
            hack6: {
                started: this._attendeeObj.Challenge_6_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_6_completed__c
                    ? true
                    : false
            },
            hack7: {
                started: this._attendeeObj.Challenge_7_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_7_completed__c
                    ? true
                    : false
            },
            hack8: {
                started: this._attendeeObj.Challenge_8_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_8_completed__c
                    ? true
                    : false
            },
            hack9: {
                started: this._attendeeObj.Challenge_8_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_8_completed__c
                    ? true
                    : false
            },
            hack10: {
                started: this._attendeeObj.Challenge_8_started__c
                    ? true
                    : false,
                completed: this._attendeeObj.Challenge_8_completed__c
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

    clear() {
        this.template
            .querySelector('.footer-spacer')
            ?.classList.remove('footer-spacer');
    }
}
