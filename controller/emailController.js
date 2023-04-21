//email gateway that allows making REST reaquest against IMAP and SMPT servers.
//Nodemailer is a module for Node.js applications to allow easy as cake email sending.

import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler"

export const sendEmail = asyncHandler( async(data, req, res) => {
  try{
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // generated ethereal user(actual user in this case is me)
          pass: process.env.PASSWORD // generated ethereal password
        },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Hey👻" <abc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
      });  
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account`
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou... 

    }catch(error){
      throw new Error(error)
    }

})
