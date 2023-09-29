import { createElement } from 'lwc';
import ErrorPanel from 'recipe/errorPanel';

describe('recipe-error-panel', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
    });

    it('displays a default friendly message', () => {
        const MESSAGE = 'Error retrieving data';

        // Create initial element
        const element = createElement('recipe-error-panel', {
            is: ErrorPanel
        });
        document.body.appendChild(element);

        const messageEl = element.shadowRoot.querySelector('h3');
        expect(messageEl.textContent).toBe(MESSAGE);
    });

    it('displays a custom friendly message', () => {
        const MESSAGE = 'Errors are bad';

        // Create initial element
        const element = createElement('recipe-error-panel', {
            is: ErrorPanel
        });
        element.friendlyMessage = MESSAGE;
        document.body.appendChild(element);

        const messageEl = element.shadowRoot.querySelector('h3');
        expect(messageEl.textContent).toBe(MESSAGE);
    });

    it('displays no error details when no errors are passed as parameters', () => {
        // Create initial element
        const element = createElement('recipe-error-panel', {
            is: ErrorPanel
        });
        document.body.appendChild(element);

        const inputEl = element.shadowRoot.querySelector('a');
        expect(inputEl).toBeNull();
    });

    it('displays error details when errors are passed as parameters', () => {
        const ERROR_MESSAGES_INPUT = [
            { statusText: 'First bad error' },
            { statusText: 'Second bad error' }
        ];
        const ERROR_MESSAGES_OUTPUT = ['First bad error', 'Second bad error'];

        // Create initial element
        const element = createElement('recipe-error-panel', {
            is: ErrorPanel
        });
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        // Simulate checking 'show details'
        const inputEl = element.shadowRoot.querySelector('a');
        inputEl.checked = true;
        inputEl.dispatchEvent(new CustomEvent('click'));

        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            const messageTexts = Array.from(
                element.shadowRoot.querySelectorAll('p')
            ).map((errorMessage) => (errorMessage = errorMessage.textContent));
            expect(messageTexts).toEqual(ERROR_MESSAGES_OUTPUT);
        });
    });

    it('is accessible when inline message', () => {
        const ERROR_MESSAGES_INPUT = [
            { statusText: 'First bad error' },
            { statusText: 'Second bad error' }
        ];

        const element = createElement('recipe-error-panel', {
            is: ErrorPanel
        });

        element.type = 'inlineMessage';
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        // Click link to show details
        element.shadowRoot.querySelector('a').click();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });

    it('is accessible when no data illustration', () => {
        const ERROR_MESSAGES_INPUT = [
            { statusText: 'First bad error' },
            { statusText: 'Second bad error' }
        ];

        const element = createElement('recipe-error-panel', {
            is: ErrorPanel
        });

        element.type = 'noDataIllustration';
        element.errors = ERROR_MESSAGES_INPUT;
        document.body.appendChild(element);

        // Click link to show details
        element.shadowRoot.querySelector('a').click();

        return Promise.resolve().then(() => expect(element).toBeAccessible());
    });
});
