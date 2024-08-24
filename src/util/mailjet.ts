import {LibraryResponse, SendEmailV3_1} from "node-mailjet";
import configJson from "../../config.json";
import {Mod} from "../entity/Mod";


const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    configJson.mj_api_key_public,
    configJson.mj_api_key_private,
    {
        config: {

        },
        options: {}
    }
);

export async function sendVerificationEmail(email: string, name: string, verificationToken: string) {

    console.log(`Sending verification email to: ${email}`);

    const data: SendEmailV3_1.Body = {
        Messages: [
            {
                From: {
                    Email: configJson.sender_email,
                    Name: "MoSim Modloader"
                },
                To: [
                    {
                        Email: email,
                    },
                ],
                Variables: {
                    "name": name,
                    "verificationToken": verificationToken,
                    "ip": configJson.ip_address
                },
                TemplateLanguage: true,
                Subject: 'Verify Your MoSim Modloader Account',
                HTMLPart: '' +
                    '<h3>{{var:name}}, thanks for signing up for MoSim Modloader!</h3><br />' +
                    'Click this link to verify your account: ' +
                    '<a href="{{var:ip}}/poster/verify?token={{var:verificationToken}}" target="_blank">Verify Account</a><br/>' +
                    'If this wasn\'t you, please click this link to cancel the account\'s creation: ' +
                    '<a href="{{var:ip}}/poster/cancel?token={{var:verificationToken}}" target="_blank">Cancel Account Creation</a><br/>'
                ,
                TextPart: '{{var:name}}, thanks for signing up for ShamParts! Click this link below to verify your account: {{var:ip}}/poster/verify?token={{var:verificationToken}}',
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    const { Status } = result.body.Messages[0];

    console.log(`Email status: ${Status}`)

    return Status;
}

export async function sendModUploadRequest(email: string, mod: Mod) {

    console.log(`Sending verification email to: ${email}`);

    const data: SendEmailV3_1.Body = {
        Messages: [
            {
                From: {
                    Email: configJson.sender_email,
                    Name: "MoSim Modloader"
                },
                To: [
                    {
                        Email: email,
                    },
                ],
                Variables: {
                    "name": mod.name,
                    "description": mod.description,
                    "ip": configJson.ip_address
                },
                TemplateLanguage: true,
                Subject: 'New MoSim Mod Uploaded/Edited',
                HTMLPart: '' +
                    'A new mod was added to MoSim: {{var:name}}' +
                    'Description: {{var:description}}' +
                    'Please review at your earliest convenience.'
                ,
                TextPart: '{{var:name}}, thanks for signing up for ShamParts! Click this link below to verify your account: {{var:ip}}/poster/verify?token={{var:verificationToken}}',
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    const { Status } = result.body.Messages[0];

    console.log(`Email status: ${Status}`)

    return Status;
}