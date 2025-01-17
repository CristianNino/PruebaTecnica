<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

include 'conexion.php';

$sql1 = "SELECT id_estudiante, nombres, apellidos FROM estudiantes";
$result1 = $conn->query($sql1);

if (!$result1) {
    echo json_encode(["error" => "Error en la consulta: " . $conn->error]);
    $conn->close();
    exit();
}

if ($result1->num_rows > 0) {
    while($row = $result1->fetch_assoc()) {
      $estudiante[] = $row; 
    }
} else {
    echo json_encode(["message" => "No se encontraron estudiantes"]);
    $conn->close();
    exit();
}

echo json_encode($estudiante);

$estudiante = array();