import { LightningElement } from 'lwc';
import { getData } from 'utils/fetchUtils';

export default class Process extends LightningElement {
    showDialog = true;
    attendeeobj;
    currentStep;
    attendeeId;
    attendeeName;
    attendeeObj;
    attendeeCode;
    isRegistered = false;
    showSpinner = false;
    showLeaderboard = false;
    allDone = false;

    connectedCallback() {
        const attendeeId = sessionStorage.getItem('attendeeId');
        const attendeeName = sessionStorage.getItem('attendeeName');
        const attendeeCode = sessionStorage.getItem('attendeeCode');
        const prizesDialogShown = sessionStorage.getItem('prizesDialogShown');

        if (prizesDialogShown) {
            this.showDialog = false;
        } else {
            sessionStorage.setItem('prizesDialogShown', true);
        }

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
                    this.hackCompletionData();
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
    }

    hackCompletionData() {
        if (this.attendeeObj != null) {
            if (this.attendeeObj.Challenge_7_completed__c == true) {
                this.allDone = true;
                this.currentStep = '4';
            } else if (this.attendeeObj.Number_of_Hacks_Completed__c == 1) {
                this.currentStep = '2';
            } else if (this.attendeeObj.Number_of_Hacks_Completed__c == 2) {
                this.currentStep = '3';
            } else if (this.attendeeObj.Number_of_Hacks_Completed__c == 3) {
                this.currentStep = '3';
            } else if (this.attendeeObj.Number_of_Hacks_Completed__c >= 4) {
                this.currentStep = '4';
                this.allDone = true;
            } else {
                this.currentStep = '1';
            }
        }
    }

    handleLWC(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: true,
                showCLI: false,
                showSlack: false,
                showTableau: false,
                showMulesoft: false
            }
        });
        this.dispatchEvent(event);
    }

    handleCLI(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: true,
                showSlack: false,
                showTableau: false,
                showMulesoft: false
            }
        });
        this.dispatchEvent(event);
    }

    handleSlack(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: true,
                showTableau: false,
                showMulesoft: false
            }
        });
        this.dispatchEvent(event);
    }

    handleTableau(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: false,
                showTableau: true,
                showMulesoft: false
            }
        });
        this.dispatchEvent(event);
    }

    handleMulesoft(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: false,
                showTableau: false,
                showVonage: false,
                showMulesoft: true
            }
        });
        this.dispatchEvent(event);
    }

    handleMulesoft(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: false,
                showTableau: false,
                showVonage: false,
                showMulesoft: true
            }
        });
        this.dispatchEvent(event);
    }

    handleFlow(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: false,
                showTableau: false,
                showMulesoft: false,
                showVonage: false,
                showFlow: true
            }
        });
        this.dispatchEvent(event);
    }
    handleVonage(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: false,
                showTableau: false,
                showMulesoft: false,
                showFlow: false,
                showVonage: true
            }
        });
        this.dispatchEvent(event);
    }

    handleMegaHack(e) {
        this.clear();
        e.currentTarget.classList.add('active');
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: false,
                showTableau: false,
                showMulesoft: false,
                showFlow: false,
                showMegaHack: true
            }
        });
        this.dispatchEvent(event);
    }

    handleClick() {
        const event = new CustomEvent('showcontent', {
            detail: {
                showLWC: false,
                showCLI: false,
                showSlack: false,
                showTableau: false,
                showMulesoft: false,
                showFlow: false,
                showMegaHack: false,
                init: true
            }
        });
        this.dispatchEvent(event);
    }

    handleOk() {
        this.showDialog = false;
    }

    clear() {
        this.template.querySelectorAll('.tile').forEach((e) => {
            e.classList.remove('active');
        });
    }
}
