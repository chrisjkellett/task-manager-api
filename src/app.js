const express = require('express');
const app = express();
const port = process.env.PORT;
require('./db/mongoose');

app.use(express.json());
app.use(require('./routes/user'));
app.use(require('./routes/task/task'));

app.listen(port, () => {
  console.log(`running on port ${port}`);
});