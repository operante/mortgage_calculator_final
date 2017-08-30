
function computeLoan() {
    let purchasePrice = document.getElementById("amount").value;
    let interestRate = document.getElementById("rate").value;
    let numbersMonths = document.getElementById("months").value;
    let downPercent = document.getElementById("downPercent").value;
    let downPayment = purchasePrice * downPercent * 0.01;
    let loanPrincipal = purchasePrice - downPayment;
    let monthlyPayment = MonthlyPayment(loanPrincipal, numbersMonths, interestRate); //monthly total payment
    document.getElementById("downpayment").innerHTML = "$" + downPayment;
    document.getElementById('newPayment').innerHTML = "Monthly Payment = $" + monthlyPayment;
}

function RequestData(loanPrincipal){
    let f = new XMLHttpRequest();
    let html = "";
    f.open('GET', './data/data.json', true);
    f.send();
    f.onreadystatechange = function() { // (3)
        if (f.readyState != 4) return;
        if (f.status != 200) {
            console.log(f.status + ': ' + f.statusText);
        } else {
            generateInnerHTML(f, html, loanPrincipal);
            }
        }
}

function MonthlyPayment (loanPrincipal, numberOfMonths, rate) {
    let monthlyInterestAmt = (loanPrincipal * (rate * .01) / numberOfMonths); //monthly interest amount
    let payment = ((loanPrincipal / numberOfMonths) + monthlyInterestAmt);
    payment = payment.toFixed(2).toString();
    return payment;
}


function generateInnerHTML(f, html, loanPrincipal) {
    let loanTerm = 360;
    let dataArray = JSON.parse(f.responseText);
    for(let i = 0; i < dataArray.length; i++){
        let lender = dataArray[i].lenderName;
        let payment = MonthlyPayment(loanPrincipal, loanTerm, rate);
        let phone = dataArray[i].phoneNumber;
        let webUrl = dataArray[i].website;
        //html = html +
        html +=
            'Lender: ' + lender + '&nbsp' +
            '<a class="glyphicon glyphicon-link" aria-hidden="true" href=' + webUrl + '></a>' + '<br>' +
            'Monthly Payment: ' + payment + '<br>' +
            'Lender Phone No.: ' + phone + '<br>' +
            'Lender Website: ' + webUrl + '<br><br>';
        // console.log(html);
        document.getElementById('lender-list').innerHTML = html;
    }
}