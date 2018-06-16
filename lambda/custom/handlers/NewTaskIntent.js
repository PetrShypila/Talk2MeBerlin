const querystring = require('querystring');
const https = require("https");

const users = {
    "sara": "54155be2d06e96a67a5d08ac",
};

const createCard = function(params) {
    let qs = querystring.stringify(
        Object.assign(
        {},
        {
            idList: '5b24625224dfd1659098a4a8',
            keepFromSource: 'all',
            key: 'e11aa993a3cf946623266a62b240ad2b',
            token: '38c8cc180c873e6c35fcd6e76cdde1a1dd85cb4d0cad7df0e69bb5d1195cc72b'
        },
        params
    ));

    console.log(`Query String: ${qs}`);

    let options = {
        method: 'POST',
        hostname: 'api.trello.com',
        port: 443,
        path: '/1/cards',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': qs.length
        }
    };

    let req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
        process.stdout.write(d);
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(qs);
    req.end();
};
  
const NewTaskIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'NewTaskIntent';
    },

    handle(handlerInput) {
        const apiParams = {};


        let speechText = 
        '<audio src="https://www.jovo.tech/audio/BCwPA7Pa-02-start-topic-2.mp3" />' +
        'Great! I added it to the trello board' +
        '<audio src="https://www.jovo.tech/audio/YPhsA6Te-03-success-2.mp3" />' +
        'You guys are awesome!' + 
        'You managed to keep the meeting short and to the point.' + 
        'If I say Pac! You say Man! PAC?';
        
        const {request} = handlerInput.requestEnvelope;
        const {Task, User} = request.intent.slots;
        console.log(`TASK: ${JSON.stringify(Task)}`);
        console.log(`USER: ${JSON.stringify(Task)}`);
        if(Task && Task.value) {
            // task presented
            apiParams.name = Task.value;

            if (User && User.value) {
                if (User.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {
                    const {name} = User.resolutions.resolutionsPerAuthority[0].values[0].value;
                    apiParams.idMembers = users[name.toLowerCase()];
                    createCard(apiParams);
                }
            } else {
                createCard(apiParams);
            }
        }

        return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Pacman', speechText)
        .getResponse();
    },
};

module.exports = NewTaskIntentHandler;
