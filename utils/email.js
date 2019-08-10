const nodemailer = require("nodemailer");

const sendEmail = async options => {
    console.log("jkl")

    //create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
console.log("jkl")
// DEFINE EMAIL OPTIONS BASICALLY HERE WE DEFINE A MAIL
    const mailOptions = {
        from: "thakurarpitpundir73@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    //3. SEND THE MAIL
    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;