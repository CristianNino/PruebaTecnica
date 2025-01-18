import { useState, useEffect } from 'react';
import axios from 'axios';

const MostrarResultados = () => {
  const [resultados, setResults] = useState([]);

  useEffect(() => {
    // Obtener los datos de los resultados desde el servicio web
    axios.get('http://localhost/api/resultados.php')
      .then(respuesta => {
        console.log('Respuesta del servidor:', respuesta.data);
        if (Array.isArray(respuesta.data)) {
          setResults(respuesta.data);
        } else {
          console.error('La respuesta no es un array:', respuesta.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Resultados del Curso</h1>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Nombre del Curso</th>
            <th>Asistió</th>
            <th>Nota</th>
            <th>Aprobado</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((resultado, index) => (
            <tr key={`${resultado.id_estudiante}-${resultado.id_curso}-${index}`}>
              <td>{resultadot.nombres} {result.apellidos}</td>
              <td>{resultado.nombre_curso}</td>
              <td>{resultado.asistio == 1 ? 'Sí' : 'No'}</td>
              <td>{resultado.nota}</td>
              <td>{resultado.aprobado == 1 ? 'Sí' : 'No'}</td>
              <td>{resultado.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MostrarResultados;