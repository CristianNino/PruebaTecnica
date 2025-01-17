import { useState, useEffect } from 'react';
import axios from 'axios';

const MostrarResultados = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Obtener los datos de los resultados desde el servicio web
    axios.get('http://localhost/api/resultados.php')
      .then(response => {
        console.log('Respuesta del servidor:', response.data);
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          console.error('La respuesta no es un array:', response.data);
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
          {results.map((result, index) => (
            <tr key={`${result.id_estudiante}-${result.id_curso}-${index}`}>
              <td>{result.nombres} {result.apellidos}</td>
              <td>{result.nombre_curso}</td>
              <td>{result.asistio == 1 ? 'Sí' : 'No'}</td>
              <td>{result.nota}</td>
              <td>{result.aprobado == 1 ? 'Sí' : 'No'}</td>
              <td>{result.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MostrarResultados;