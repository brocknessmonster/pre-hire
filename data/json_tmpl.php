<?php

if ($_GET['type'] == 'form') {

    require_once('../scripts/form.php');

    $form = new Form(0,100);

    echo json_encode($form->init());

} else if ($_GET['type'] == 'process') {

    require_once('../scripts/processor.php');
    require_once('../scripts/database.php');

    $results = new Processor($_POST['randNumberArr']);

    $payload = json_encode($results->init());

    $db = new Database();
    $db->init($payload,'numbers'); // insert number values into mysql tbl number_results
    $db->init($payload,'results'); // insert results values into mysql tbl computed_results

    echo $payload;

}

