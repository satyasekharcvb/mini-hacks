module.exports = class RestUtils {
    constructor(sfdc) {
        this.sfdc = sfdc;
    }

    doApexGet(url, req, res) {
        this.sfdc.apex.get(url, (err, apexResponse) => {
            if (err) {
                res.status(500).send(err);
            } else {
                let responseJson = JSON.parse(apexResponse);
                if (responseJson.isSuccess) {
                    res.json(responseJson.data);
                } else {
                    res.statusMessage = responseJson.data;
                    res.status(400).send();
                }
            }
        });
    }
};
