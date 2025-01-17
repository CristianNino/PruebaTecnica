<?php

// Configuración para que el servidor responda como JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conectar a la base de datos
$mysqli = new mysqli("localhost", "root", "", "bd_instituto");

// Verificar si la conexión fue exitosa
if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Iniciar la transacción
    $mysqli->begin_transaction();

    try {
        // Aquí irían las consultas para insertar los resultados
        $stmt = $mysqli->prepare("INSERT INTO resultados (id_estudiante, id_curso, asistio, nota, aprobado, observaciones) VALUES (?, ?, ?, ?, ?, ?)");

        // Recibir y procesar los datos desde el cuerpo de la solicitud
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            echo json_encode(["error" => "No se recibieron datos válidos", "received" => file_get_contents('php://input')]);
            exit();
        }

        foreach ($data as $studentId => $studentData) {
            // Asignar los valores correctamente
            $idestudiante = $studentId;
            $idcurso = 1;  // Usar el id del curso correspondiente
            $asistio = isset($studentData['asistio']) && $studentData['asistio'] ? 1 : 0;
            $nota = $studentData['nota'];
            $aprobado = isset($studentData['aprobado']) && $studentData['aprobado'] ? 1 : 0;
            $observaciones = $studentData['observaciones'];

            // Ejecutar la consulta de inserción
            $stmt->bind_param("iissss", $idestudiante, $idcurso, $asistio, $nota, $aprobado, $observaciones);
            $stmt->execute();
        }

        // Si todo va bien, hacer commit de la transacción
        $mysqli->commit();
        echo json_encode(["success" => true, "message" => "Resultados guardados correctamente."]);
    } catch (Exception $e) {
        // Si algo sale mal, hacer rollback
        $mysqli->rollback();
        echo json_encode(["error" => "Ocurrió un error: " . $e->getMessage()]);
    } finally {
        // Cerrar la conexión
        $stmt->close();
        $mysqli->close();
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Obtener los resultados de la base de datos con JOIN para obtener nombres
    $query = "
        SELECT r.id_estudiante, e.nombres, e.apellidos, r.id_curso, c.nombre AS nombre_curso, r.asistio, r.nota, r.aprobado, r.observaciones
        FROM resultados r
        JOIN estudiantes e ON r.id_estudiante = e.id_estudiante
        JOIN cursos c ON r.id_curso = c.id_curso
    ";
    $result = $mysqli->query($query);

    $results = [];
    while ($row = $result->fetch_assoc()) {
        $results[] = $row;
    }

    echo json_encode($results);
    $mysqli->close();
}
?>