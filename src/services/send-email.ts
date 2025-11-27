import nodemailer from 'nodemailer'
export const sendEmail = async (userEmail: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "saimshehzad2040@gmail.com",
      pass: "fdzo hgag vbrj wxxp",
    },
  });

  const mailOptions = {
    from: "noreply@get2Gether.com",
    to: userEmail,
    subject: subject,
    text: message,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};
