import { LightningElement } from 'lwc';
import { getData } from 'utils/fetchUtils';

export default class Register extends LightningElement {
    name;
    email;
    attendeeId;
    error;

    showSpinner = false;

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleClick() {
        let isValid = true;
        this.template.querySelectorAll('lightning-input').forEach((ele) => {
            if (!ele.checkValidity()) {
                ele.reportValidity();
                isValid = false;
            }
        });
        if (isValid) {
            this.showSpinner = true;
            getData('https://sf-mini-hacks.herokuapp.com/api/register', {
                name: this.name,
                email: this.email
            })
                .then((result) => {
                    const event = new CustomEvent('registrationcomplete', {
                        detail: { result, name: this.name }
                    });
                    this.dispatchEvent(event);
                })
                .catch((error) => {
                    this.error = error;
                })
                .finally(() => {
                    this.showSpinner = false;
                });
        }
    }
}
