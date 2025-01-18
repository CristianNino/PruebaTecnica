import { useState, useEffect } from 'react';
import axios from 'axios';

const Finalizarcurso = () => {

  const [estudiantes, setStudents] = useState([]);
  const [datos, setFormData] = useState({});
 
  useEffect(() => {

    axios.get('http://localhost/api/estudiantes.php')
      .then(respuesta => {
        console.log('Respuesta del servidor:', respuesta.data);
        if (Array.isArray(respuesta.data)) {
          setStudents(respuesta.data);
        } else {
          console.error('La respuesta no es un array:', respuesta.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleChange = (e, estudianteId) => {

    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const estudiante = estudiantes.find(s => s.id_estudiante === estudianteId);

    if (name === 'nota' && (parseFloat(value) > 5 || parseFloat(value) < 0)) {
      alert(`La nota para ${estudiante.nombres} ${estudiante.apellidos} debe estar entre 0 y 5.`);
      return; 
    }

    setFormData(prevState => ({
      ...prevState,
      [estudianteId]: {
        ...prevState[estudianteId],
        [name]: fieldValue
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const estudianteId in datos) {
      const datoEstudiante = datos[estudianteId];
      if (
        datoEstudiante.nota == undefined ||
        datoEstudiante.nota == '' ||
        datoEstudiante.observaciones == undefined ||
        datoEstudiante.observaciones == ''
      ) {
        const estudiante = estudiantes.find(st => st.id_estudiante === parseInt(estudianteId));
        const studentName = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Estudiante';
        alert(`Por favor diligencie todos los campos `);
        return;
      }
    }

    //objeto donde se va a enviar

    const cleanedData = {}; 
    Object.keys(datos).forEach(estudianteId => {
      const studentData = datos[estudianteId];
      cleanedData[estudianteId] = {
        asistio: studentData.asistio || false,
        nota: studentData.nota || 0,
        aprobado: studentData.aprobado || false,
        observaciones: studentData.observaciones || ''
      };
    });

    console.log('Datos enviados:', cleanedData);

    axios.post('http://localhost/api/resultados.php', JSON.stringify(cleanedData), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(respuesta => {
      console.log('Respuesta del servidor:', respuesta.data);
      alert('Resultados guardados exitosamente');
    })
    .catch(error => {
      console.error('Error al guardar los datos:', error);
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Cierre del Curso</h1>
      <form onSubmit={handleSubmit}>
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Asistió</th>
              <th>Nota Final</th>
              <th>Aprobó</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map(estudiante => (
              <tr key={estudiante.id_estudiante}>
                <td>{estudiante.id_estudiante}</td>
                <td>{estudiante.nombres} {estudiante.apellidos}</td>
                <td>
                  <input
                    type="checkbox"
                    name="asistio"
                    className="form-check-input"
                    onChange={(e) => handleChange(e, estudiante.id_estudiante)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="nota"
                    min="0"
                    max="5"
                    className="form-control"
                    onChange={(e) => handleChange(e, estudiante.id_estudiante)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="aprobado"
                    className="form-check-input"
                    onChange={(e) => handleChange(e, estudiante.id_estudiante)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="observaciones"
                    className="form-control"
                    onChange={(e) => handleChange(e, estudiante.id_estudiante)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="btn btn-light btn-block">Guardar Resultados</button>
      </form>
    </div>
  );
};

export default Finalizarcurso;