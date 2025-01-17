<?php
$servername = "localhost";
$username = "root";
$password = "";
$bdmane = "bd_instituto";

$conn = new mysqli($servername, $username, $password, $bdmane);

if ($conn -> connect_error){
    die ("conexion fallida: ". $conn -> connection_error);
}else{

}
?>