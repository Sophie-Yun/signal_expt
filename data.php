<?php
    $dataFile = fopen("data.txt", "a");
    fwrite($dataFile, $_POST["data"]);
    fclose($dataFile);
?>