const results_tmpl = "\n" + 
"    <table>\n" +
"        <caption>Computed Results For Submitted Data</caption>\n" +
"        <thead>\n" +
"            <tr>\n" +
"              <th>Property</th>\n" +
"              <th>Value</th>\n" +
"            </tr>\n" +
"        </thead>\n" +
"        <tbody id=\"resultsData\">\n" +
"        </tbody>\n" +
"    </table>\n";


const form_tmpl = "\n" + 
"<form class=\"form\" id=\"random_number_form\">\n" +
"    <table>\n" +
"        <caption>Input Numbers Between 0 and 100</caption>\n" +
"        <thead>\n" +
"            <tr>\n" +
"              <th>#</th>\n" +
"              <th>Value</th>\n" +
"            </tr>\n" +
"        </thead>\n" +
"        <tbody id=\"randomData\">\n" +
"        </tbody>\n" +
"    </table>\n" +
"    <p class=\"right-text\"><button class=\"submit_btn\">Submit</button></p>\n" + 
"</form>\n";

class Form {

    constructor(options) {
      this.height = options.height;
      this.width = options.width;
      this.formTmpl = options.form_tmpl;
      this.resultsTmpl = options.results_tmpl;
    }

    async postFormData() {
        const formEl = document.querySelector('.form');
        await fetch('/data/json_tmpl.php?type=process', {
            method: 'POST',
            body: new FormData(formEl),
        })
        .then((response) => response.json())
        .then((data) => {
            this.appendOuterTmpl('results');
            this.appendResultsRows(data);
        });
    }

    async getFormData(){
        const response = await fetch('/data/json_tmpl.php?type=form');
        const data = await response.json();
        this.appendTbodyRow(data);
    }

    validateData(buttonEl) {
        const inputElArr = document.getElementsByName('randNumberArr[]');
        let errorFlag = 0; // no errors
        Array.prototype.forEach.call(inputElArr,(inputEl) => {
            inputEl.style.backgroundColor = 'transparent';
            if (isNaN(Number(inputEl.value))) {
                errorFlag = 1;
                inputEl.style.backgroundColor = 'red';
            } else {
                if (Number(inputEl.value) > 100 || Number(inputEl.val) < 0) {
                    errorFlag = 1;
                    inputEl.style.backgroundColor = 'red';
                }
            }
        });
        if (errorFlag != 0) {
            return false;
        }
        buttonEl.disabled = true;
        this.postFormData();
    }
        

    bindSubmit() {
        document.getElementsByTagName('button')[0].addEventListener('click',(e)=>{
            e.preventDefault();
            this.validateData(e.target); // passing e.target -> reference to button el            
        });
    }

    tableRowMaker(rowNumber,randNumber,context) {
        let dynamicRow = null;
        if (rowNumber == 'salesTaxValue'){
            rowNumber = 'sales tax value';
        }
        if (context == 'form') {
            dynamicRow = "             <td><input class=\"right-text\" type=\"text\" value=\"" + randNumber + "\" name=\"randNumberArr[]\"></td>\n";
        } else if (context == 'results') {
            dynamicRow = "             <td class=\"right-text\">" + randNumber + "</td>\n";
        }
        return "\n" + 
        "         <tr>\n" + 
        "             <td class=\"right-text\">" + rowNumber + "</td>\n" + 
        dynamicRow +
        "         </tr>\n";
    }

    appendOuterTmpl(tmplName) {
        if (tmplName == 'form') {
            document.getElementsByClassName('form_wrapper')[0].innerHTML = this.formTmpl;
        } else if (tmplName == 'results') {
            document.getElementsByClassName('results_wrapper')[0].innerHTML = this.resultsTmpl;
        }
    }

    appendResultsRows(results) {
        for(const property in results) {
            if (property != 'numbers') {
                let results_row = this.tableRowMaker(property,results[property],'results');
                document.getElementById('resultsData').innerHTML += results_row;
            }
        }
    }

    appendTbodyRow(formData) {
        let rowNumber = 0;
        while(rowNumber < formData.random_numbers.length) {
            const randNumber = formData.random_numbers[rowNumber];
            rowNumber++;
            let table_row = this.tableRowMaker(rowNumber,randNumber,'form');
            document.getElementById('randomData').innerHTML += table_row;
        }
        this.bindSubmit();
    }

    init() {
        this.appendOuterTmpl('form');
        this.getFormData();
    }

}

