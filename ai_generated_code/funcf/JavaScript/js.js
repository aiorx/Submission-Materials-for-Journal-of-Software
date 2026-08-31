function calcRes(){
const payment= document.paym.amount.value;
const term= document.paym.term.value;
const interest= document.paym.rate.value;
const result= document.paym.type.value;


//mathimatical calculations are Produced using common development resources, lel 2mana

    const monthlyRate = interest / 12; // Convert annual interest rate to monthly
    const totalPayments = term; // Total number of monthly payments

    // Mortgage payment formula
    if(result==1){
        const monthlyPayment = payment * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
        document.getElementById('amount2').textContent=`$${monthlyPayment.toFixed(4)}`;
        document.getElementById('amount3').textContent=`$${(monthlyPayment*12).toFixed(4)}`;
    }
    else if(result==2){
            const firstMonthInterest = payment * monthlyRate;
            document.getElementById('amount2').textContent=`$${firstMonthInterest.toFixed(4)}`;
            document.getElementById('amount3').textContent=`$${(firstMonthInterest*12).toFixed(4)}`;
    }

}