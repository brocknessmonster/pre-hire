const results_tmpl = `
    <table>
        <caption>Computed Results For Submitted Data</caption>
        <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
        </thead>
        <tbody id="resultsData">
        </tbody>
    </table>`;


const form_tmpl = ` 
<form class="form" id="random_number_form">
    <table>
        <caption>Input Numbers Between 0 and 100</caption>
        <thead>
            <tr>
              <th>#</th>
              <th>Value</th>
            </tr>
        </thead>
        <tbody id="randomData">
        </tbody>
    </table>
    <p class="right-text"><button class=\"submit_btn\">Submit</button></p>
</form>`;

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
            dynamicRow = `             <td><input class="right-text" type="text" value="${randNumber}" name="randNumberArr[]"></td>`;
        } else if (context == 'results') {
            dynamicRow = `             <td class="right-text">${randNumber}</td>`;
        }
        return `
                 <tr>
                     <td class="right-text">${rowNumber}</td>
        ${dynamicRow}
                 </tr>`;
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

