<?php 

class Processor {

    public $errorFlag = 0; // 0 -> no error, -1 -> $val outside 0 - 100 range or $val !is_numeric()

    public $meanValue = -1;
    
    public $sumValues = 0;
    
    public $numberValues = 0;

    public $lowestVal = -1;

    public $highestVal = -1;

    public $modeValu = -1;

    public $placeholder = null;

    public $randNumberArr = [];

    public $randNumberArrRaw = [];

    public $modeArr = [];

    public $salesTaxValue = -1;
    
    public function __construct($randomNumberArr){
        $this->randNumberArrRaw = $randomNumberArr;
    }

    public function findLowestValue() {
        $this->lowestValue = (int)$this->randNumberArr[0];
    }

    public function findHighestValue() {
        $lastKey = count($this->randNumberArr) - 1;
        $this->highestValue = (int)$this->randNumberArr[$lastKey];
    }

    public function calculateSalesTax() {
        $salesTax = $this->sumValues * 0.015;
        $this->salesTaxValue = number_format((float)$salesTax, 2, '.', '');
    }

    public function calculateMean() {
        $this->meanValue = $this->sumValues / $this->numberValues;
    }

    public function calculateMode() {
        $this->modeArr = array_count_values($this->randNumberArr);
        foreach($this->modeArr as $key => $val) {
            if ($val == 1) {
                unset($this->modeArr[$key]);
            }
        }
        if(count($this->modeArr) > 0 ) {
            /* sort mode by val */
            asort($this->modeArr);
            $this->modeValue = array_key_last($this->modeArr);
        } else {
            $this->modeValue = 'There is no mode value';
        }
    }

    public function processPost() {
        foreach($this->randNumberArrRaw as $key => $val) {
            $this->randNumberArr[] = $val;
            $this->numberValues++;
            $this->sumValues += $val;
            /* mode test */
            if (in_array($val,$this->randNumberArr)) {
                if(isset($this->modeArr[$val])) {
                    $this->modeArr[$val]++;
                } else {
                    $this->modeArr[$val] = 1;
                }
            }
        }
    }

    public function createResultsPayload() {
        $payload = new stdClass();
        $payload->mode = $this->modeValue;
        $payload->mean = $this->meanValue;
        $payload->lowest = $this->lowestValue;
        $payload->highest = $this->highestValue;
        $payload->total = $this->sumValues;
        $payload->salesTaxValue = $this->salesTaxValue;
        $payload->numbers = $this->randNumberArr;
        return $payload;
    }

    public function init() {
        $this->processPost();
        sort($this->randNumberArr);
        $this->findHighestValue();
        $this->findLowestValue();
        $this->calculateMean();
        $this->calculateMode();
        $this->calculateSalesTax();
        return $this->createResultsPayload();
    }

}