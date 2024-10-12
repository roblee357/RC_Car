const express = require('express');
const { SerialPort } = require('serialport');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { ReadlineParser } = require('@serialport/parser-readline');
const { promisify } = require('util');

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://192.168.42.1:3000', // client URL where React is running
    methods: ['POST', 'GET'], // Add methods you expect from the client
  }));

// Define the port you want to connect to. This might vary based on your setup.
const serialPort = new SerialPort({
    path: '/dev/ttyUSB0',  // Adjust this path as needed for your system
    baudRate: 115200
});

// Function to map joystick values (assuming they come in -1 to 1) to 0-1023
function mapToRange(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Create parser for incoming data
const parser = new ReadlineParser({ delimiter: '\n' });
serialPort.pipe(parser);

// Listen for data from serial port
parser.on('data', (data) => {
  console.log('Serial response:', data);
});

serialPort.write = promisify(serialPort.write);

app.post('/api/joystick', async (req, res) => {
    const { x, y } = req.body;
    console.log(`Received Joystick Data: X=${x}, Y=${y}`);
    const xMapped = Math.floor(mapToRange(y, -1, 1, 0, 1023));
    const yMapped = Math.floor(mapToRange(x, -1, 1, 0, 1023));
    const motorData = `${yMapped},${xMapped}\n`;
    console.log('Sending to motor:', motorData);

    try {
        await serialPort.write(motorData);
        res.json({ status: 'sent', y: yMapped , x: xMapped});
    } catch (err) {
        console.error('Error sending data:', err);
        res.status(500).json({ error: 'Failed to send data to motor' });
    }
});

// app.post('/api/joystick', (req, res) => {
//   const { x, y } = req.body;
//   console.log(`Received Joystick Data: X=${x}, Y=${y}`);
//     // Assuming x and y are in range -1 to 1 from the joystick
//     const xMapped =  Math.floor(mapToRange(y, -1, 1, 0, 1023));
//     const yMapped =  Math.floor(mapToRange(x, -1, 1, 0, 1023));


//     // Send over serial
//     const motorData = `${xMapped},${yMapped}\n`;
//     console.log('Sending to motor:', motorData);
//     serialPort.write(motorData, (err) => {
//         if (err) {
//             return console.log('Error on write: ', err.message);
//         }
//         // console.log('message written');
//     });

//     res.json({ status: 'sent', x: xMapped, y: yMapped });
// //   res.json({ status: 'received', message: `Motor signals sent for X=${x}, Y=${y}` });
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
