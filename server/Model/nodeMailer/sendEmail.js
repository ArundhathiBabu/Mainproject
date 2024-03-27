const nodeMailer =require('nodemailer');
const sendEmail=async(email,otp)=>{
    const transporter=nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:"aru88334@gmail.com",
            pass:"iwmt kqid nazg pxve",
        },
    });
    const info = await transporter.sendMail({
        from:'"EverGlow"<aru88334@gmail.com>',
        to: email,
        subject:"Reset Password",
        html:`<h2>${otp}</h2>`,
    })
}
module.exports=sendEmail