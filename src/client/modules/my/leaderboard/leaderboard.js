import { LightningElement } from 'lwc';
import { getData } from 'utils/fetchUtils';

const PAGE_SIZE = 20;

export default class Leaderboard extends LightningElement {
    result;

    currentIndex = 0;
    currentResult;

    intervalId;
    anotherIntervalId;

    totalLength;
    numPages;
    currentPageNumber = 1;

    allResults;

    async connectedCallback() {
        await this.getLeaderboard();
        this.getCurrentResult();
        this.refreshResult();
    }

    disconnectedCallback() {
        clearInterval(this.intervalId);
        clearInterval(this.anotherIntervalId);
    }

    paginate(array, page_size, page_number) {
        return array.slice(
            (page_number - 1) * page_size,
            page_number * page_size
        );
    }

    async getLeaderboard() {
        let result = await getData(
            'https://sf-mini-hacks.herokuapp.com/api/leaderboard'
        );
        this.result = JSON.parse(result);
        const numResults = this.result.numHacksCompleted.length;
        this.numPages = Math.ceil(numResults / PAGE_SIZE);
        this.allResults = this.result['numHacksCompleted'].map((ele, index) => {
            let sno = index + 1;
            return {
                row_number: sno,
                ...ele
            };
        });
    }

    refreshResult() {
        this.intervalId = setInterval(() => {
            this.getCurrentResult();
        }, 30000);

        this.anotherIntervalId = setInterval(async () => {
            await this.getLeaderboard();
        }, 300000);
    }

    getCurrentResult() {
        this.currentResult = this.paginate(
            this.allResults,
            PAGE_SIZE,
            this.currentPageNumber
        );
        this.currentPageNumber++;
        if (this.currentPageNumber > this.numPages) {
            this.currentPageNumber = 1;
        }
    }
}
