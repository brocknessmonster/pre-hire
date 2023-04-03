<?php

class Form {

    public $placeholder = null;

    public $min = 0;

    public $max = 100;

    public $payload = null;

    public $randomNumArr = [];

    public $numInputs = 1;

    public function __construct($min,$max) {
        $this->min = $min;
        $this->max = $max;
    }

    public function createPayload() {
        $i = 0;
         while($i < $this->numInputs) {
            $this->randomNumArr[] = $this->integerGenerator($this->min,$this->max);
            $i++;
         }
         $this->payload = new stdClass();
         $this->payload->num_inputs = $this->numInputs;
         $this->payload->random_numbers = $this->randomNumArr;
    }

    public function integerGenerator($min,$max){
        return mt_rand($min,$max);
    }

    public function setNumInputs(){
        $this->numInputs = $this->integerGenerator($this->min,$this->max);
    }

    function init() {
        $this->setNumInputs();
        $this->createPayload();
        return $this->payload;
    }


}