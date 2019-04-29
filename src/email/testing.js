const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_API_TOKEN);

function newTaskEmailConfirmation(task, user){
  sgMail.send({
    to: user.email,
    from: "cjkellett@hotmail.co.uk",
    subject: `New task ${task.desc}`,
    text: `Hi ${user.name} - you have created a new task at ${task.createdAt}`
  });
}

module.exports = {
  newTaskEmailConfirmation
}

