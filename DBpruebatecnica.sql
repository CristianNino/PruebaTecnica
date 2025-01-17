CREATE DATABASE BD_Instituto;
USE BD_Instituto;

-- Tabla Cursos
CREATE TABLE Cursos (
    id_curso INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_finalizacion DATE,
    archivos varchar(255)
);

-- Tabla Profesores
CREATE TABLE Profesores (
    id_profesor INT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(255),
    apellidos VARCHAR(255),
    numero_identificacion VARCHAR(50) UNIQUE
);

-- Tabla Horarios_Curso
CREATE TABLE Horarios_Curso (
    id_horario INT PRIMARY KEY AUTO_INCREMENT,
    id_curso INT,
    dia VARCHAR(50),
    hora TIME,
    id_profesor INT,
    FOREIGN KEY (id_curso) REFERENCES Cursos(id_curso),
    FOREIGN KEY (id_profesor) REFERENCES Profesores(id_profesor)
);

-- Tabla Disponibilidad_Profesor
CREATE TABLE Disponibilidad_Profesor (
    id_disponibilidad INT PRIMARY KEY AUTO_INCREMENT,
    id_profesor INT,
    dia VARCHAR(50),
    hora_inicio TIME,
    hora_fin TIME,
    FOREIGN KEY (id_profesor) REFERENCES Profesores(id_profesor)
);

-- Tabla Estudiantes
CREATE TABLE Estudiantes (
    id_estudiante INT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(255),
    apellidos VARCHAR(255),
    numero_identificacion VARCHAR(50) UNIQUE
);

-- Tabla Inscripciones
CREATE TABLE Inscripciones (
    id_inscripcion INT PRIMARY KEY AUTO_INCREMENT,
    id_estudiante INT,
    id_curso INT,
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id_estudiante),
    FOREIGN KEY (id_curso) REFERENCES Cursos(id_curso)
);

-- Tabla Asistencia_Evaluaciones
CREATE TABLE Resultados (
    id_resultado INT PRIMARY KEY AUTO_INCREMENT,
    id_estudiante INT,
    id_curso INT,
    asistio BOOLEAN,
    nota INT CHECK (nota >= 0 AND nota <= 5),
    aprobado BOOLEAN,
    observaciones TEXT,
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id_estudiante),
    FOREIGN KEY (id_curso) REFERENCES Cursos(id_curso)
);

-- Tabla Contactos
CREATE TABLE Contactos (
    id_contacto INT PRIMARY KEY AUTO_INCREMENT,
    id_persona INT,
    tipo_contacto VARCHAR(50),
    valor_contacto VARCHAR(255),
    FOREIGN KEY (id_persona) REFERENCES Profesores(id_profesor)
);

INSERT INTO Cursos (nombre, descripcion, fecha_finalizacion,archivos) VALUES ('Curso de Java', 'Introducción a Java', '2025-12-31','libro de programacion');
INSERT INTO Cursos (nombre, descripcion, fecha_finalizacion,archivos) VALUES ('Curso de Python', 'Introducción a Python', '2026-10-31','libro de programacion I');
INSERT INTO Cursos (nombre, descripcion, fecha_finalizacion,archivos) VALUES ('Curso de C', 'Introducción a C', '2024-12-24','libro de programacion I');
INSERT INTO Cursos (nombre, descripcion, fecha_finalizacion,archivos) VALUES ('Curso de kotlin', 'Introducción a desarrollo movil', '2028-1-17','libro desarrollo movil');

INSERT INTO Profesores (nombres, apellidos, numero_idenficacion) VALUES ('Ana','Maria','24681012');
INSERT INTO Profesores (nombres, apellidos, numero_idenficacion) VALUES ('Cristian','Perez','1234567');
INSERT INTO Profesores (nombres, apellidos, numero_idenficacion) VALUES ('Camilo','Diaz','1357911');
INSERT INTO Profesores (nombres, apellidos, numero_idenficacion) VALUES ('Juliana','Suarez','9874563');

INSERT INTO Horarios_Curso (id_curso, dia, hora, id_profesor) VALUES (1, 'Lunes', '10:00', 1);
INSERT INTO Horarios_Curso (id_curso, dia, hora, id_profesor) VALUES (1, 'Jueves', '9:00', 2);
INSERT INTO Horarios_Curso (id_curso, dia, hora, id_profesor) VALUES (3, 'jueves', '12:00', 2);
INSERT INTO Horarios_Curso (id_curso, dia, hora, id_profesor) VALUES (4, 'Miercoles', '15:00', 4);

INSERT INTO Estudiantes (nombres, apellidos, numero_identificacion) VALUES ('Juan', 'Rodriguez', '1122334455');
INSERT INTO Estudiantes (nombres, apellidos, numero_identificacion) VALUES ('Sergio', 'Acero', '35715946');
INSERT INTO Estudiantes (nombres, apellidos, numero_identificacion) VALUES ('Alejandra', 'Torres', '75395128');
INSERT INTO Estudiantes (nombres, apellidos, numero_identificacion) VALUES ('Valentina', 'Gonzales', '7539514862');

INSERT INTO Inscripciones (id_estudiante, id_curso) VALUES (1, 1);
INSERT INTO Inscripciones (id_estudiante, id_curso) VALUES (2, 1);
INSERT INTO Inscripciones (id_estudiante, id_curso) VALUES (2, 3);
INSERT INTO Inscripciones (id_estudiante, id_curso) VALUES (1, 2);

-- Consultas

-- Cursos activos
SELECT id_curso, nombre, descripcion, fecha_finalizacion, archivos 
FROM Cursos WHERE fecha_finalizacion >= CURDATE();

-- Estudiantes inscritos en un curso
SELECT e.id_estudiante, e.nombres, e.apellidos, c.nombre AS nombre_curso FROM Inscripciones i
JOIN Estudiantes e ON i.id_estudiante = e.id_estudiante
JOIN Cursos c ON i.id_curso = c.id_curso
WHERE c.id_curso = 1; 

-- Estdiantes que han pasado un curso ordenando la nota
SELECT e.id_estudiante, e.nombres, e.apellidos, c.nombre AS nombre_curso, r.nota FROM Resultados r
JOIN Estudiantes e ON r.id_estudiante = e.id_estudiante
JOIN Cursos c ON r.id_curso = c.id_curso
WHERE r.aprobado = 1 ORDER BY r.nota DESC;

-- Mejores promedios y sus profesores
SELECT c.id_curso, c.nombre AS nombre_curso, AVG(r.nota) AS promedio_nota, CONCAT(p.nombres, ' ', p.apellidos) AS profesor FROM Resultados r
JOIN Cursos c ON r.id_curso = c.id_curso
JOIN Horarios_Curso h ON c.id_curso = h.id_curso
JOIN Profesores p ON h.id_profesor = p.id_profesor
GROUP BY c.id_curso, p.id_profesor
ORDER BY promedio_nota DESC;

-- estudiantes que han perdido cursos
SELECT e.id_estudiante, e.nombres, e.apellidos, COUNT(r.id_resultado) AS cursos_perdidos, AVG(r.nota) AS promedio_nota FROM Resultados r
JOIN Estudiantes e ON r.id_estudiante = e.id_estudiante
WHERE r.aprobado = 0
GROUP BY e.id_estudiante
ORDER BY cursos_perdidos DESC;

-- rango de notas de un profesor
SELECT CONCAT(p.nombres, ' ', p.apellidos) AS profesor, c.nombre AS curso, 
COUNT(CASE WHEN r.nota BETWEEN 0 AND 1 THEN 1 END) AS rango_0_1,
COUNT(CASE WHEN r.nota BETWEEN 1 AND 2 THEN 1 END) AS rango_1_2,
COUNT(CASE WHEN r.nota BETWEEN 2 AND 3 THEN 1 END) AS rango_2_3,
COUNT(CASE WHEN r.nota BETWEEN 3 AND 4 THEN 1 END) AS rango_3_4,
COUNT(CASE WHEN r.nota BETWEEN 4 AND 5 THEN 1 END) AS rango_4_5
FROM Resultados r
JOIN Cursos c ON r.id_curso = c.id_curso
JOIN Horarios_Curso h ON c.id_curso = h.id_curso
JOIN Profesores p ON h.id_profesor = p.id_profesor
GROUP BY p.id_profesor, c.id_curso;

-- estudiantes inscritos en un horario
SELECT E.nombres, E.apellidos
FROM Estudiantes E
JOIN Inscripciones I ON E.id_estudiante = I.id_estudiante
JOIN Horarios_Curso H ON I.id_curso = H.id_curso
WHERE H.id_horario = 1;

-- cusrsos tomados por un estudiante
SELECT c.nombre, c.descripcion, c.fecha_finalizacion FROM Inscripciones i
JOIN Cursos c ON i.id_curso = c.id_curso
WHERE i.id_estudiante = 1;













