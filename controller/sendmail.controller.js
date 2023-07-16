const pug = require("pug");
const AWS = require("aws-sdk");
const config = {
  accessKeyId: "AKIAY7V4FA6S4B7Z2RFL",
  secretAccessKey: "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",
  region: "ap-south-1"
}

const mailer = new AWS.SES(config);

const tokenService = require("../services/token.service");
const sendEmail = async (request,response)=>{
  const token = await tokenService.verifyToken(request);
  if(token.isVerified)
  {
    let data = JSON.parse(request.body.reciept);
    const emailInfo = {
        Destination: {
          ToAddresses: [
            data.to
          ]
        },
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: data.subject
          },
          Body: {
            Html: {
                Charset: "UTF-8",
                Data: pug.renderFile("C:/Users/Wap Institute/Desktop/frontwap/views/email-template.pug",data)
            }
          }
        },
        Source: "adsewap@gmail.com"

    }
    try {
      await mailer.sendEmail(emailInfo).promise();
      response.status(200);
      response.json({
        message: "Sending success"
      });
    }
    catch(error)
    {
      response.status(424);
      response.json({
        message: "Sending failed"
      });
    }
  }
  else {
    response.status(401);
    response.json({
      message: "Permission denied !"
    });
  }
}

module.exports = {
  sendEmail: sendEmail
}
