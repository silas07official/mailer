const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const { EMAIL, PASSWORD } = require("../env.js");

// Send mail from testing account
const signup = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let message = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        mssg: "You will receive a message shortly",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

// Send mail from real Gmail account
const getBill = (req, res) => {
  const { userEmail, userName } = req.body;
  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Marty Digitals",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: userName,
      intro: "We have received a password reset request!",
      
      action: {
        instructions: 'If this request was from you, please proceed by clicking the button below. \n else ignore this message',
        button: {
            color: '#0000FF', // Optional action button color
            text: 'Reset Password',
            link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
        }
    },
      outro: "Looking forward to do more business",
    },
    
  };
  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "Password Reset Email",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        mssg: "You will receive a message shortly",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  //   res.status(201).json("getBill Successfully");
};

module.exports = { signup, getBill };
