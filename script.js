const API_KEY = "ENTER_YOUR_API_KEY";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// DOM Elements
const form = document.querySelector('form');
const fromSelect = document.querySelector('#from_country');
const toSelect = document.querySelector('#to_country');
const display = document.querySelector("#display");
const swapBtn = document.querySelector("#swap-btn");
// Create a variable to hold the rates in memory


// Helper function to keep our code DRY
const createOptionElement = (value, isSelected)=>{
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    option.selected = isSelected;
    return option;
}


const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
};


// Initialization: Load currency options
async function loadOptions() {
    try {
        const res = await fetch(`${BASE_URL}/latest/USD`);
        if (!res.ok) throw new Error("Failed to fetch currency list");

        const data = await res.json();

        cachedRates = data.conversion_rates;

        for (const countryCode in data.conversion_rates) {
            fromSelect.appendChild(createOptionElement(countryCode, countryCode === "USD"));
            toSelect.appendChild(createOptionElement(countryCode, countryCode === "INR"));
        }
    } catch (err) {
        console.error("Initialization Error:", err);
        console.log(`Check your api key: ${API_KEY}`);
        display.textContent = "Error loading currencies.";
    }
}


// Event Listener: Handle conversion
form.addEventListener("submit",(e) => {
   e.preventDefault(); 

    const formData = new FormData(form);
    const { from_country: from, to_country: to, input_value: amount } = Object.fromEntries(formData);

    // Calculate the rate locally using our cached data
    const rateFrom = cachedRates[from];
    const rateTo = cachedRates[to];
    const exchangeRate = rateTo / rateFrom;
    
    const rawConvertedAmount = amount * exchangeRate;

    const formattedFrom = formatCurrency(amount, from);
    const formattedToAmt = formatCurrency(rawConvertedAmount, to);

    display.textContent = `${formattedFrom} = ${formattedToAmt}`;

});

swapBtn.addEventListener("click",()=>{
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
});




// Start the app
loadOptions();