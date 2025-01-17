<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

include 'conexion.php';

$sql = "SELECT * FROM Cursos WHERE fecha_finalizacion >= CURDATE()";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => "Error en la consulta: " . $conn->error]);
    $conn->close();
    exit();
}

$curso = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $curso[] = $row; 
    }
} else {
    echo json_encode(["message" => "No se encontraron cursos"]);
    $conn->close();
    exit();
}

echo json_encode($curso);

$conn->close();

?>