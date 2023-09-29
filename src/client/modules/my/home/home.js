import { LightningElement } from 'lwc';
import { getData } from 'utils/fetchUtils';

export default class Home extends LightningElement {
    isRegistered = false;
    showSpinner = false;
    showLeaderboard = false;
    attendeeId;
    attendeeName;
    attendeeObj;
    attendeeCode;

    handleRegComplete(event) {
        this.attendeeName = event.detail.name;
        this.attendeeObj = JSON.parse(event.detail.result);
        this.attendeeId = this.attendeeObj.Id;
        this.attendeeCode = this.attendeeObj.Random_String__c;
        sessionStorage.setItem('attendeeId', this.attendeeId);
        sessionStorage.setItem('attendeeName', this.attendeeName);
        sessionStorage.setItem('attendeeCode', this.attendeeCode);
        this.isRegistered = true;
        this.showSpinner = false;
    }

    connectedCallback() {
        const attendeeId = sessionStorage.getItem('attendeeId');
        const attendeeName = sessionStorage.getItem('attendeeName');
        const attendeeCode = sessionStorage.getItem('attendeeCode');
        if (attendeeId && attendeeName) {
            this.showSpinner = true;
            getData('https://sf-mini-hacks.herokuapp.com/api/retrieve', {
                attendeeId
            })
                .then((result) => {
                    this.attendeeObj = JSON.parse(result);
                    this.isRegistered = true;
                    this.attendeeId = attendeeId;
                    this.attendeeName = attendeeName;
                    this.attendeeCode = attendeeCode;
                    sessionStorage.setItem('attendeeObj', result);
                })
                .catch((error) => {
                    this.error = error;
                })
                .finally(() => {
                    this.showSpinner = false;
                });
        } else {
            this.showSpinner = false;
        }

        if (window.location.href.includes('leaderboard')) {
            this.showLeaderboard = true;
        }
    }

    logout() {
        sessionStorage.clear();
        window.location.reload();
    }
}
