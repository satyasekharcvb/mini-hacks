import { LightningElement, api } from 'lwc';
import { getData } from 'utils/fetchUtils';

export default class VerifyHack extends LightningElement {
    @api hackNumber;
    @api attendeeId;
    @api hackCompleted;
    @api attendeeCode;

    showKey = false;
    key;
    showSpinner = false;
    error;

    verify() {
        this.showKey = true;
    }

    handleKeyChange(event) {
        this.key = event.target.value;
    }

    completeHack(e) {
        let isValid = false;
        this.error = null;
        const keyElement = this.template.querySelector('.key');
        const keyValue = keyElement.value;
        if (keyValue && keyValue.length > 0) {
            keyElement.setCustomValidity('');
            isValid = true;
        } else {
            keyElement.setCustomValidity('Please enter a valid key');
        }
        keyElement.reportValidity();
        if (isValid) {
            this.showSpinner = true;
            getData('https://sf-mini-hacks.herokuapp.com/api/complete', {
                attendeeId: this.attendeeId,
                hackNumber: this.hackNumber,
                verifiedBy: keyValue
            })
                .then((result) => {
                    const event = new CustomEvent('hackverified', {
                        detail: { hackNumber: this.hackNumber }
                    });
                    this.dispatchEvent(event);
                })
                .catch((error) => {
                    this.error = 'Invalid Staffer Key';
                })
                .finally(() => {
                    this.showSpinner = false;
                });
        }
    }
}
