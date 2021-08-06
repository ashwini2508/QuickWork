const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const express = require('express')
const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN} = require('./credentials')
const app = express();
const port = process.env.PORT || 5000                       
app.use(express.json())
app.listen(port, () => console.log(`app listening on port ${port}!`))


const oAuth2Client = new google.auth.OAuth2 (CLIENT_ID, CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})                        //setting the cre

async function sendMail(to){
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth : {
                type: 'OAuth2',
                user: 'ashwinikumar25082000@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
                 
        })

        const mailOptions = {
            from : 'ASHWINI KUMAR <ashwinikumar25082000@gmail.com>',
            to : to,
            subject: "A task from QuickWork",
            text : 'I have tried to finished the given task',
            html : '<h1>finished the given task...</h1>'
        };

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}

app.get('/sendMail', async (req, res) => {
    try {
        const {to} = req.body
        const Quickwork = await sendMail(to) 
        console.log(Quickwork)
        res.status(200).send(Quickwork)
    } catch (error) {
        console.log(error)
    }
})