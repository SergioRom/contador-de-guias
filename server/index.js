const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const axios = require('axios');
const cors = require('cors');
const API_KEY =
  '4496d3f8b0ac6513334aa7cf22ef16322b799bd822cac6d724c0116cfd2b232a';
app.use(cors());
app.use(express.json());

server.listen(3001, () => {
  console.log('Listening on *:3001');
});

let config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

let data = JSON.stringify({
  origin: {
    name: 'oscar mx',
    street: 'polanco',
    number: '123',
    district: '',
    city: 'a',
    state: 'CX',
    country: 'MX',
    postalCode: '11560',
    reference: '',
  },
  destination: {
    name: 'oscar',
    street: 'avenue',
    number: '',
    district: '',
    city: 'clarksburg',
    state: 'WV',
    country: 'US',
    postalCode: '12345',
    reference: '',
  },
  shipment: {
    carrier: 'fedex',
    trackingNumber: '794694435969',
  },
  packages: [
    {
      currency: 'MXN',
      observations: '',
      cost: 0,
      cubicMeters: 0.001,
      insurance: 0,
      declaredValue: 0,
      weightUnit: 'kg',
      lengthUnit: 'cm',
      items: [
        {
          description: 'red shirt',
          quantity: 1,
          price: 1,
        },
        {
          description: 'white shirt',
          quantity: 1,
          price: 1,
        },
        {
          description: 'black shirt',
          quantity: 1,
          price: 1,
        },
      ],
      amount: 1,
      totalWeight: 2,
    },
  ],
});

let cantGuias = 0;
io.on('connection', (socket) => {
  socket.on('nueva_conexion', () => {
    socket.emit('guias_creadas', cantGuias);
  });

  socket.on('crear_guia', () => {
    axios
      .post(
        'https://envia-api-dev.herokuapp.com/ship/billoflading',
        data,
        config
      )
      .then((res) => {
        console.log(`statusCode: ${res.status}`);
        console.log(res);
        cantGuias += 1;
        socket.broadcast.emit('guias_creadas', cantGuias);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
