import { LightningElement, api } from 'lwc';
import { getData } from 'utils/fetchUtils';

export default class Teammate extends LightningElement {
    @api attendeeCode;
    @api hackNumber;
    @api teamList;

    teammateCode;
    attendeeId;
    teammateName;
    hasTeamMate;
    status;
    teamObj;
    teamingInProgress;
    teamingCompleted;

    connectedCallback() {
        this.fetchTeamData();
    }

    handleCancelClick(event) {
        this.hasTeamMate = false;
        this.teamingInProgress = false;
    }

    handleRefreshClick(event) {
        this.fetchTeamData();
    }

    handleCodeChange(event) {
        this.teammateCode = event.target.value;
    }

    fetchTeamData() {
        this.attendeeId = sessionStorage.getItem('attendeeId');
        if (this.attendeeId) {
            getData('https://sf-mini-hacks.herokuapp.com/api/fetchTeams', {
                attendeeId: this.attendeeId,
                hackNumber: this.hackNumber
            })
                .then((result) => {
                    this.teamList = JSON.parse(result);

                    this.teammateName = this.teamList.teamMate;
                    this.status = this.teamList.status;

                    if (this.teammateName && this.status) {
                        if (this.status == 'In Progress') {
                            this.teamingInProgress = true;
                            this.hasTeamMate = true;
                        } else if (this.status == 'New') {
                            this.hasTeamMate = false;
                        } else {
                            this.hasTeamMate = true;
                            this.teamingCompleted = true;
                            this.teamingInProgress = false;
                        }
                    }
                })
                .catch((e) => {
                    console.error(e);
                });
        }
    }

    handleClick() {
        let isValid = true;
        this.template.querySelectorAll('lightning-input').forEach((ele) => {
            if (!ele.checkValidity()) {
                isValid = false;
            }
            ele.reportValidity();
        });
        this.attendeeId = sessionStorage.getItem('attendeeId');
        if (isValid) {
            getData('https://sf-mini-hacks.herokuapp.com/api/formTeam', {
                attendeeId: this.attendeeId,
                uniqueCode: this.teammateCode,
                hackNumber: this.hackNumber
            })
                .then((result) => {
                    this.teamObj = JSON.parse(result);
                    if (this.teamObj.Team_Member_1__c != this.attendeeId) {
                        this.teammateName =
                            this.teamObj.Team_Member_1__r.Attendee_Full_Name__c;
                    } else {
                        this.teammateName =
                            this.teamObj.Team_Member_2__r.Attendee_Full_Name__c;
                    }
                    this.status = this.teamObj.Teaming_Status__c;
                    if (this.status == 'In Progress') {
                        this.teamingInProgress = true;
                        this.hasTeamMate = true;
                    } else {
                        this.hasTeamMate = true;
                        this.teamingCompleted = true;
                    }
                })
                .catch((error) => {
                    //this.error = JSON.parse(error);
                    const ele = this.template.querySelector('.code');
                    ele.setCustomValidity(error.message);
                    ele.reportValidity();
                })
                .finally(() => {
                    this.showSpinner = false;
                });
        }
    }
}
