function computeLoan() {
    let purchasePrice = document.getElementById("amount").value;
    let interestRate = document.getElementById("rate").value * 0.01;
    let numbersMonths = document.getElementById("months").value * 12;
    let downPercent = document.getElementById("downPercent").value * 0.01;
    let downPayment = purchasePrice * downPercent;
    let loanPrincipal = purchasePrice - downPayment;
    let monthlyPayment = new MonthlyPayment(loanPrincipal, numbersMonths, interestRate); //monthly total payment
    let totalEverything = monthlyPayment.payment * numbersMonths;
    let totalInterest = totalEverything - loanPrincipal;

    document.getElementById("downpayment").innerHTML = "$" + downPayment;
    document.getElementById('newPayment').innerHTML = "Monthly Payment = $" + monthlyPayment.payment;
    document.getElementById('monthly').innerHTML = "Your monthly total payment is: " + "$" + monthlyPayment.payment;
    document.getElementById('total').innerHTML = "Your total payment: " + "$" + totalEverything.toFixed(2);
    document.getElementById('interest').innerHTML = "Your interest amount is: " + "$" + totalInterest.toFixed(2);
}

/* Calculate Monthly Payment, used in both User the specified rate as well as lender-term specific rates
 *
 * M = P * (r(1+r)^n / (1+r)^n - 1)
 * M: Monthly Payment
 * P: Principal
 * r: monthly interest rate, calculated by dividing your annual interest rate by 12.
 * n: number of payments (the number of months you will be paying the loan)[6]
 */

function MonthlyPayment (loanPrincipal, numberOfMonths, rate) {
    let monthlyRate = (rate/12);         // This is r.
    let payment = loanPrincipal *
        ((monthlyRate*(1 + monthlyRate)**numberOfMonths)/((1 + monthlyRate)**numberOfMonths - 1)); // monthly payment
    this.payment = payment.toFixed(2).toString();
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


function generateInnerHTML(f, html, loanPrincipal) {
    let loanTerm = 360;
    let dataArray = JSON.parse(f.responseText);
    for(let i = 0; i < dataArray.length; i++){
        let lender = dataArray[i].lenderName;
        let rate = dataArray[i].mortgageRate;
        let monthlyPayment = new MonthlyPayment(loanPrincipal, loanTerm, rate);
        let phone = dataArray[i].phoneNumber;
        let webUrl = dataArray[i].website;
        html +=
            'Lender: ' + lender + '&nbsp' +
            '<a class="glyphicon glyphicon-link" aria-hidden="true" href=' + webUrl + '></a>' + '<br>' +
            'Monthly Payment: ' + monthlyPayment.payment + '<br>' +
            'Lender Phone No.: ' + phone + '<br>' +
            'Lender Website: ' + webUrl + '<br><br>';
        document.getElementById('lender-list').innerHTML = html;
    }
}
