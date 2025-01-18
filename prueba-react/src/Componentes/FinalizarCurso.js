import { useState, useEffect } from 'react';
import axios from 'axios';

const Finalizarcurso = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({});
 

  useEffect(() => {
    // Obtener los datos de los estudiantes desde el servicio web
    axios.get('http://localhost/api/estudiantes.php')
      .then(response => {
        console.log('Respuesta del servidor:', response.data);
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else {
          console.error('La respuesta no es un array:', response.data);
        }
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleChange = (e, studentId) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    const student = students.find(s => s.id_estudiante === studentId);

    if (name === 'nota' && (parseFloat(value) > 5 || parseFloat(value) < 0)) {
      alert(`La nota para ${student.nombres} ${student.apellidos} debe estar entre 0 y 5.`);
      return; // Evita que el valor se registre si es inválido
    }

    setFormData(prevState => ({
      ...prevState,
      [studentId]: {
        ...prevState[studentId],
        [name]: fieldValue
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const studentId in formData) {
      const studentData = formData[studentId];
      if (
        studentData.nota == undefined ||
        studentData.nota == '' ||
        studentData.observaciones == undefined ||
        studentData.observaciones == ''
      ) {
        const student = students.find(st => st.id_estudiante === parseInt(studentId));
        const studentName = student ? `${student.nombres} ${student.apellidos}` : 'Estudiante';
        alert(`Por favor diligencie todos los campos `);
        return; // Detener el envío si faltan campos
      }
    }

    const cleanedData = {}; // Preparamos el objeto de datos que se va a enviar
    Object.keys(formData).forEach(studentId => {
      const studentData = formData[studentId];
      cleanedData[studentId] = {
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
    .then(response => {
      console.log('Respuesta del servidor:', response.data);
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
            {students.map(student => (
              <tr key={student.id_estudiante}>
                <td>{student.id_estudiante}</td>
                <td>{student.nombres} {student.apellidos}</td>
                <td>
                  <input
                    type="checkbox"
                    name="asistio"
                    className="form-check-input"
                    onChange={(e) => handleChange(e, student.id_estudiante)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="nota"
                    min="0"
                    max="5"
                    className="form-control"
                    onChange={(e) => handleChange(e, student.id_estudiante)}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    name="aprobado"
                    className="form-check-input"
                    onChange={(e) => handleChange(e, student.id_estudiante)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="observaciones"
                    className="form-control"
                    onChange={(e) => handleChange(e, student.id_estudiante)}
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