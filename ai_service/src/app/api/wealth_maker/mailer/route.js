import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { NextResponse } from "next/server";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI_MAIL;
const refreshToken = process.env.REFRESH_TOKEN;
const gmailUser = process.env.GMAIL_USER;
const yeImgPath = process.env.YE_IMG_PATH;
const OAuth2 = google.auth.OAuth2;

export async function POST(req){
    if (req.method === 'POST') {
        const { recipientName, recipientEmail, message } = await req.json();

        const oauth2Client = new OAuth2(
            clientId,
            clientSecret,
            redirectUri,
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });

        const accessToken = await oauth2Client.getAccessToken();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            type: 'OAuth2',
            user: gmailUser,
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken: accessToken,
            },
        });

        try {
            await transporter.sendMail({
            from: `AI Service Team <${gmailUser}>`,
            to: recipientEmail,
            subject: `Quote of the day for ${recipientName}`,
            html:`
            <h3>Dear ${recipientName},</h3>
            <br/>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="width: 30%; padding: 10px; vertical-align: top;">
                        <img style="width: 80%; height: auto;" src="cid:y1" alt="Golden Ratio Face"/>
                    </td>
                    <td style="width: 70%; padding: 10px; vertical-align: center; text-aling: left;">
                        <h1>${message}</h1>
                    </td>
                </tr>
            </table>
            <br/>
            <h3>Love,<br/>AI Service Team</h3>`,
            attachments: [{
                filename: "goldenrationface.png",
                path: yeImgPath,
                cid: "y1",
            }]
            });
            return NextResponse.json({ message: "Email sent" }, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "Fail to send email" }, {status: 500});
        }
    } else {
        return NextResponse.json({ message: "Method not Allowed" }, {status: 405});
    }
}