var xhttp = new XMLHttpRequest();
var currencyBaseSymbol = 'EUR';
var curFromElement = document.getElementById("cur_from");
var curToElement = document.getElementById("cur_to");
var curTextElement = document.getElementById("cur_text");
var resultElement = document.getElementById("result");

/*
    Implement function that fills currency from/to select boxes with currency codes
    and fills scrolling text with rates against currencyBaseSymbol
*/
function loadCurrency() {
    xhttp.open('GET', 'http://api.fixer.io/latest', true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            alert( 'Error:' + (this.status ? this.statusText : 'bad request') );
            return;
        }

        var resp = JSON.parse(this.responseText);
        var base = resp.base;

        banner = 'BASE - '+base+' =>';
        curFromElement.innerHTML='';
        curToElement.innerHTML='';
        for(key in resp.rates) {

            var option = document.createElement("option");
            option.text = key;
            option.value = key;
            curFromElement.appendChild(option);

            var option = document.createElement("option");
            option.text = key;
            option.value = key;
            curToElement.appendChild(option);

            banner += key + ": " + resp.rates[key]+', ';
        }
        curTextElement.textContent = banner;
    }

}

/*
    Implement function that converts from one selected currency to another filling result text area.
 */
function getRates() {
    /* your code goes here */
    cur_amount = document.getElementById('cur_amount').value;
    if (cur_amount == ''){
        cur_amount = 1;
    }
    from = curFromElement.options[curFromElement.selectedIndex].value;
    to = curFromElement.options[curToElement.selectedIndex].value;
    if (from == to){
        document.getElementById('result').textContent = 1;
    }else{
        xhttp.open('GET', 'http://api.fixer.io/latest'+'?base='+from+'', true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState != 4) return;

            if (this.status != 200) {
                alert('Error: ' + (this.status ? this.statusText : 'bad request'));
                return;
            }
            var res = JSON.parse(this.responseText);
            exch = res.rates[to]

            result = cur_amount*exch;

            document.getElementById('result').textContent = result.toFixed(4);
        }
    }
}

// Load currency rates when page is loaded
window.onload = function() {
    // Run loadCurrency func to fetch currencies data and set this function to run every 60 sec.
    (() => {loadCurrency(); setInterval(loadCurrency, 1000 * 60);})();
    var btn = document.getElementById('run');
    btn.addEventListener("click", getRates);
};
