// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const jwt = require('salesforce-jwt-bearer-token-flow');
const jsforce = require('jsforce');
const bodyParser = require('body-parser');
const RestUtils = require('./restUtils.js');
const path = require('path');
const cors = require('cors');

const SSE = require('express-sse');

const basicAuth = require('express-basic-auth');

require('dotenv').config();

let sse = new SSE();

const app = express();
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'sf-mini-hacks.herokuapp.com'],
            scriptSrcElem: [
                "'self'",
                "'unsafe-inline'",
                'sf-mini-hacks.herokuapp.com'
            ],
            styleSrcElem: [
                "'self'",
                "'unsafe-inline'",
                '*.salesforce.com',
                'sf-mini-hacks.herokuapp.com'
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                '*.salesforce.com',
                'sf-mini-hacks.herokuapp.com'
            ],
            imgSrc: [
                "'self'",
                '*.salesforce.com',
                'sf-mini-hacks.herokuapp.com'
            ]
        }
    })
);
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;

const DIST_DIR = './dist';

app.use(express.static(DIST_DIR));

let conn;
let restUtilsObj;

// Read Environment Variables
const { SF_CONSUMER_KEY, SF_USERNAME, SF_LOGIN_URL } = process.env;
let PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
    PRIVATE_KEY = require('fs').readFileSync('private.pem').toString('utf8');
}

let SF_NAMESPACE = process.env.SF_NAMESPACE;
if (!SF_NAMESPACE) {
    SF_NAMESPACE = '';
}

if (!(SF_CONSUMER_KEY && SF_USERNAME && SF_LOGIN_URL && PRIVATE_KEY)) {
    console.error(
        'Cannot start app: missing mandatory configuration. Check your environment variables'
    );
    process.exit(-1);
}
// Authenticate to Salesforce using JWT Flow
jwt.getToken(
    {
        iss: SF_CONSUMER_KEY,
        sub: SF_USERNAME,
        aud: SF_LOGIN_URL,
        privateKey: PRIVATE_KEY
    },
    (err, tokenResponse) => {
        if (tokenResponse) {
            conn = new jsforce.Connection({
                instanceUrl: tokenResponse.instance_url,
                accessToken: tokenResponse.access_token
            });
            restUtilsObj = new RestUtils(conn);
        } else if (err) {
            console.error(err);
            process.exit(-1);
        }
    }
);

// Redirect all non /api/ endpoint requests to index.html
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.resolve(DIST_DIR + '/index.html'));
});

// Initialize Server Sent Events
app.get('/api/updatesstream', sse.init);

// Keep SSE Connection Alive
const HEARTBEAT_INTERVAL = process.env.HEARTBEAT_INTERVAL || 30 * 1000; // 30 seconds
const heartBeat = () => sse.send(':ping');
setInterval(heartBeat, HEARTBEAT_INTERVAL);

app.get('/api/sendupdateonstream', function (req, res) {
    const { sessionId } = req.query;
    sse.send('refreshnow_' + sessionId);
    res.json({
        success: true
    });
});

app.get('/api/register', function (req, res) {
    const { name, email, tshirtSize } = req.query;
    const url = `/minihacks/register?name=${encodeURIComponent(
        name
    )}&email=${email}&tshirtSize=${tshirtSize}`;
    restUtilsObj.doApexGet(url, req, res);
});

app.get('/api/start', function (req, res) {
    const { attendeeId, hackNumber } = req.query;
    const url = `/minihacks/start?attendeeId=${attendeeId}&hackNumber=${hackNumber}`;
    restUtilsObj.doApexGet(url, req, res);
});

app.get('/api/complete', function (req, res) {
    const staffers = [
        'a.chhabra','adelawalla','ahazen','ajoyson','akurian','alexandra.martinez','amanry','amirzadeh','anderson.tsai',
        'aniket.bhattacharya','arjun.garg','asingh4','atendulkar','austin.oliver','avinash.varanasi','betty.yip','brotner',
        'bschulzrobellaz','cbunkar','claire.mckenzie','codonnell','cpona','daniel.castro','dbhandall','dchandrikavegi','dflinter',
        'djuang','dkifle','dniemann','dominique.riley','dsolomon','ekraay','fdejonckheere','gdonnalley','gkainth','glenda.thomson',
        'habdelkodous','hector.reyes','hongyizhang','hrothstein','i.shaik','jdefreitas','jeffrey.lu','jemens','jerry.thomas',
        'jessica.knapp','jlupton','jordan.jackson','jrymph','k.lu','kcaraway','kdace','keith.conley','kelly.kline','kzhan',
        'lchristenbury','lknell','mamata.vartak','manchuri','mariajose.hernandez','maya.peterson','mciardullo','mgaide','mgerrbi',
        'mholikatti','michael.burns','mihirshah','mmyking','mpimenta','nmanyala','parvez.mohamed','patrick.price','pcaligan',
        'ppradhan','rajeev.shankar','rajeev.singh','ravi.kiran','rciga','revathi.muthukumar','rnguyen','rumapathy','ryan.gunderson',
        'schou','shannon.dunn','shaun.russell','sid.sah','sidan.qi','sillivillarreal','skumarreddy','srangaswamy','ssavoie','tkingmiller',
        'tkramer','tpandey','tyler.beauchamp','vdagala','vincent.perez','vpintozakher','wong.jason','zkampel','atopalli','ssekhar','michael.crump'
        ,'diana.pham','chris.tankersley','nick.iati','lucinda.abberley','mariajose.hernandez'
    ];
    const { attendeeId, hackNumber, verifiedBy } = req.query;
    if (staffers.includes(verifiedBy)) {
        const url = `/minihacks/complete?attendeeId=${attendeeId}&hackNumber=${hackNumber}&verifiedBy=${encodeURIComponent(
            verifiedBy
        )}`;
        restUtilsObj.doApexGet(url, req, res);
    } else {
        res.status(400).json({ message: 'Invalid staffer key' });
    }
});

app.get('/api/retrieve', function (req, res) {
    const { attendeeId } = req.query;
    const url = `/minihacks/retrieve?attendeeId=${attendeeId}`;
    restUtilsObj.doApexGet(url, req, res);
});
app.get('/api/fetchTeams', function (req, res) {
    const { attendeeId, hackNumber } = req.query;
    const url = `/minihacks/fetchTeams?attendeeId=${attendeeId}&hackNumber=${hackNumber}`;
    restUtilsObj.doApexGet(url, req, res);
});
app.get('/api/formTeam', function (req, res) {
    const { attendeeId, uniqueCode, hackNumber } = req.query;
    const url = `/minihacks/formTeam?attendeeId=${attendeeId}&uniqueCode=${uniqueCode}&hackNumber=${hackNumber}`;
    restUtilsObj.doApexGet(url, req, res);
});

app.get('/api/leaderboard', function (req, res) {
    const url = `/minihacks/leaderboard`;
    restUtilsObj.doApexGet(url, req, res);
});

app.get(
    '/api/animals',
    basicAuth({
        challenge: true,
        users: { admin: 'pa55w0rd' },
        unauthorizedResponse: (req) => {
            return 'Unauthorized';
        }
    }),
    (req, res) => {
        res.json([
            {
                id: 1,
                name: 'Tiger',
                'food-category': 'Carnivore',
                count: 42,
                'park-name': 'Wild Animal Safari'
            },
            {
                id: 2,
                name: 'Giant Panda',
                'food-category': 'Herbivore',
                count: 6,
                'park-name': 'Metro Zoo'
            },
            {
                id: 3,
                name: 'Lion',
                'food-category': 'Carnivore',
                count: 36,
                'park-name': 'Wild Animal Safari'
            },
            {
                id: 4,
                name: 'Gray Wolf',
                'food-category': 'Carnivore',
                count: 120,
                'park-name': 'Wild Animal Safari'
            },
            {
                id: 5,
                name: 'Black rhinoceros',
                'food-category': 'Herbivore',
                count: 12,
                'park-name': 'Green Park'
            },
            {
                id: 6,
                name: 'Giraffe',
                'food-category': 'Herbivore',
                count: 58,
                'park-name': 'Metro Zoo'
            }
        ]);
    }
);

app.get(
    '/api/offercode',
    basicAuth({
        challenge: true,
        users: {
            'codeybear01@dd23er072.com': 'ilovekoa',
            'codeybear02@dd23er073.com': 'ilovekoa',
            'codeybear03@dd23er074.com': 'ilovekoa',
            'codeybear04@dd23er075.com': 'ilovekoa',
            'codeybear05@dd23er076.com': 'ilovekoa',
            'codeybear06@dd23er077.com': 'ilovekoa',
            'codeybear07@dd23er078.com': 'ilovekoa',
            'codeybear08@dd23er079.com': 'ilovekoa',
            'codeybear09@dd23er080.com': 'ilovekoa',
            'codeybear10@dd23er081.com': 'ilovekoa',
            'codeybear11@dd23er082.com': 'ilovekoa',
            'codeybear12@dd23er083.com': 'ilovekoa'
        },
        unauthorizedResponse: (req) => {
            return 'Unauthorized';
        }
    }),
    (req, res) => {
        const { secret } = req.query;
        if (secret === '42T65') {
            res.json({
                offerCode: 'FY658Z3LU8'
            });
        } else {
            res.json({
                offerCode: 'Check the secret and try again'
            });
        }
    }
);

app.listen(PORT, () =>
    console.log(`✅  API Server started: http://${HOST}:${PORT}`)
);
