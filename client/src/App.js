import './App.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;
const CONNECTION_PORT = 'localhost:3001/';

function App() {
  const [cantGuias, setCantGuias] = useState('0');

  useEffect(() => {
    socket = io(CONNECTION_PORT);
    socket.emit('nueva_conexion');
  }, []);

  useEffect(() => {
    socket.on('guias_creadas', (data) => {
      setCantGuias(data);
    });
  });

  const crearGuia = () => {
    setCantGuias(parseInt(cantGuias) + 1);
    socket.emit('crear_guia');
  };

  return (
    <div className='App'>
      <div className='App'>
        <h1>Guías Generadas: {cantGuias}</h1>
        <button onClick={crearGuia}>Generar Guía</button>
      </div>
    </div>
  );
}

export default App;
