const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('The test worked!');
});

app.get('/one', (req, res) => {
  res.send('The one test worked!');
});

app.get('/two', (req, res) => {
  res.send('The two test worked!');
});

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:\n
    Base URL: ${req.baseUrl}\n
    Host: ${req.hostname}\n
    Path: ${req.path}\n
    Headers: ${req.rawHeaders}\n
    `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end();
});

app.get('/greetings', (req, res) => {
  const name = req.query.name;
  const race = req.query.race;

  if (!name) {
    return res.status(400).send('Please provide a name!');
  }
  if (!race) {
    return res.status(400).send('Please provide a race!');
  }

  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom!`;
  res.send(greeting);
});

app.get('/sum', (req, res) => {
  const num1 = parseInt(req.query.num1);
  const num2 = parseInt(req.query.num2);

  if (!num1 || !num2) {
    return res.status(400).send('Please enter two numbers!');
  }

  const sum = num1 + num2;
  res.send(`The sum of ${num1} and ${num2} is ${sum}!`);
});

function cipher(string, shift) {
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let shifted = 'abcdefghijklmnopqrstuvwxyz'.split('');
  for (let i = 0; i < shift; i++) {
    let letter = shifted.shift();
    shifted = [...shifted, letter];
  }
  let stringCode = string
    .toLowerCase()
    .split('')
    .map((item) => (item = alphabet.indexOf(item)));
  let cipherString = stringCode.map((item) => (item !== -1 ? (item = `${shifted[item]}`) : (item = ' ')));
  return cipherString.join('');
}

app.get('/cipher', (req, res) => {
  const text = req.query.text;
  const shift = parseInt(req.query.shift);

  if (!text || !shift) {
    return res.status(200).send('You must enter text and a number!');
  }
  res.status(200).send(cipher(text, shift));
});

function lotto(arr) {
  let userArr = arr.sort((a, b) => a - b);
  let lottoArr = [];
  while (lottoArr.length < 6) {
    lottoArr = [...lottoArr, Math.round(Math.random() * (20 - 1) + 1)];
  }
  lottoArr = lottoArr.sort((a, b) => a - b);
  let results = userArr.filter((num) => lottoArr.indexOf(num) !== -1);
  return { results, lottoArr };
}

app.get('/lotto', (req, res) => {
  let userArr = req.query.numbers.split(', ').map((x) => +x);
  if (!userArr || userArr.length !== 6) {
    return res.status(400).send('You must enter 6 numbers!');
  }
  let { results, lottoArr } = lotto(userArr);
  let matchString = results.length < 4 ? `You matched ${results.length}. You lose!` : results.length === 4 ? `You matched ${results.length}! You win a free ticket!` : results.length === 5 ? `You matched ${results.length}! You win $100!` : `You matched ${results.length}! You won the jackpot!`;

  res.status(200).send(`Your numbers were: ${userArr.join(', ')}
            The winning numbers were: ${lottoArr.join(', ')}
            ${matchString}
                `);
});

app.listen(8000, () => {
  console.log('The server is listening... on port 8000.');
});
