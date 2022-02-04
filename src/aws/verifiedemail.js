
const AWS = require('aws-sdk');

const SES_CONFIG = {
    accessKeyId: 'AKIARLJJDKUDJWUPWF32',
    secretAccessKey: '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',
    region: 'ap-south-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const sendEmail = (recipientEmail, name) => {
    let params = {
        Source: 'inboxsizzr@gmail.com',
        Destination: {
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: 'This is the body of my email!',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `Hello, ${name}!`,
            }
        },
    };
    return AWS_SES.sendEmail(params).promise();
};

const sendRawEmail = (recipientEmail, name) => {

    var rawMessage = [
        `From: "inboxsizzr@gmail.com" <inboxsizzr@gmail.com>`, // Can be just the email as well without <>
        `To: inboxzahidkhan@gmail.com`,
        `Subject: Test email`,
        `MIME-Version: 1.0`,
        `Message-ID: <@eu-west-1.amazonses.com>`, // Will be replaced by SES
        `Date: Justadate`, // Will be replaced by SES
        `Return-Path: <@eu-west-1.amazonses.com>`, // Will be replaced by SES
        `Content-Type: text/plain; charset=UTF-8`,
        `\n`,
        'THIS IS JUST A TEST EMAIL',
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
    ]

    let params = {
        Source: 'inboxsizzr@gmail.com',
        Destinations: [
            'inboxzahidkhan@gmail.com'
        ],
        RawMessage: {
            Data: 'HEY'
        },
    };
    return AWS_SES.sendRawEmail(params).promise();
};

const sendTemplateEmail = (recipientEmail) => {
    let params = {
        Source: '<email address you verified>',
        Template: '<name of your template>',
        Destination: {
            ToAddresses: [
                recipientEmail
            ]
        },
        TemplateData: '{ \"name\':\'John Doe\'}'
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
};



module.exports = {
    sendEmail,
    sendTemplateEmail,
    sendRawEmail
};