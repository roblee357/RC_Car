// src/App.js
import React, { useState } from 'react';
import { Joystick } from 'react-joystick-component';
import axios from 'axios';

function App() {
  const [position, setPosition] = useState({ y: 0, x: 0 });
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = (joystickData) => {
    let x, y;
    if (joystickData && joystickData.position) {
        ({ x, y } = joystickData.position);
    } else if (joystickData && joystickData.x !== undefined && joystickData.y !== undefined) {
        ({ x, y } = joystickData);
    } else {
        console.log('Joystick moved, but no x, y data available in expected format.');
        return;
    }
    setPosition({ x , y});
    console.log(`Stick Position in App: X=${x}, Y=${y}`);
  // Call sendToServer here with the x and y values
  sendToServer({  x , y });
};

  const handleStop = () => {
    console.log('Joystick stopped.');
    // let x, y;
    // { x, y } =  {0,0};
    // setPosition({x, y});
    setIsMoving(false); // Joystick is no longer moving
    sendToServer({  x: 0 , y: 0 }); // Send stop command
  };

  const sendToServer = async (data) => {
    try {
      await axios.post('http://192.168.42.1:5000/api/joystick', data);
      console.log('Joystick data sent to server');
    } catch (error) {
      console.error('Failed to send joystick data:', error);
    }
  };




  return (
    <div className="App">
      <Joystick
        size={window.innerWidth} // Set size to full width of browser //size={100}
        // baseColor="#AAAAAA"
        // stickColor="#FFFFFF"
        move={handleMove}
        stop={handleStop} // Add stop event handler
      />
      {/* <p>Current Position: X={position.x}, Y={position.y}</p> */}
    </div>
  );
}

export default App;
