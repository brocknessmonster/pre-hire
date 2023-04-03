<?php

$db = new mysqli('database','lamp','lamp','lamp');

if ($db->connect_error) {
    die("Error: " . $db->connect_error);   
} else {

}

$result = $db->query('SHOW TABLES');


class Database {

    /* 
    tables are number_results and computed_results
    number_results contains random numbers between 0 and 100 from form input
    computed_results contains mean, mode, highest, lowest, sum, tax computed values
    */

    public function __construct(){

    }

    public $dbError = null;

    public $db = null;

    public function testConnection(){
        $this->db = new mysqli('database','lamp','lamp','lamp');
        if ($this->db->connect_error) {
            $this->dbError = $this->db->connect_error;
        }
    }

    public function insertNumbers($data) {
        /* $data should be an array of numbers from the form */
        $insertStr = "INSERT INTO number_results(`result_value`) VALUES ";
        $valuesStr = "";
        foreach($data as $key => $value) {
            $valuesStr .= "(".$value."),";
        }
        $cleanValuesStr = rtrim($valuesStr,",");
        $insertStr .= $cleanValuesStr;
        $results = $this->db->query($insertStr);
        return $results->affected_rows;
    }

    public function insertResults($data) {
        $insertStr = "INSERT INTO computed_results(`computed_result_label`,`computed_result_value`) VALUES ";
        $valuesStr = "";
        foreach($data as $key => $value) {
            $valuesStr .= "(".$key.",".$value."),";
        }
        $cleanValuesStr = rtrim($valuesStr,",");
        $insertStr .= $cleanValuesStr;
        $results = $this->db->query($insertStr);
        return $results->affected_rows;
    }

    public function init($jsonData,$context) {
        $this->testConnection();
        $data = json_decode($jsonData);
        if ($context == 'numbers') {
            $result = $this->insertNumbers($data->numbers);
        } else if ($context == 'results') {
            unset($data->numbers);
            $result = $this->insertResults($data);
        }
        var_dump($result);
    }

}