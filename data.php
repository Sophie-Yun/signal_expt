<?php
    $dataFile = fopen("data.txt", "a");
    fwrite($dataFile, $_POST["postData"]);
    fclose($dataFile);
?>