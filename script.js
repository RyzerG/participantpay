document.addEventListener('DOMContentLoaded', () => {
    // Get elements from the DOM
    const startTimeEl = document.getElementById('startTime');
    const endTimeEl = document.getElementById('endTime');
    const rateAmountEl = document.getElementById('rateAmount');
    const rateMinutesEl = document.getElementById('rateMinutes');
    const roundingToggleEl = document.getElementById('roundingToggle');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const paymentAmountEl = document.getElementById('paymentAmount');
    const errorDiv = document.getElementById('error');

    // --- Event Listener for the Calculate Button ---
    calculateBtn.addEventListener('click', () => {
        // Clear previous results and errors
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';

        // --- 1. Get and Validate Inputs ---
        const startTime = startTimeEl.value;
        const endTime = endTimeEl.value;
        const rateAmount = parseFloat(rateAmountEl.value);
        const rateMinutes = parseInt(rateMinutesEl.value, 10);
        const shouldRoundUp = roundingToggleEl.checked;

        if (!startTime || !endTime || isNaN(rateAmount) || isNaN(rateMinutes)) {
            showError('Please fill in all fields with valid numbers.');
            return;
        }

        if (rateAmount <= 0 || rateMinutes <= 0) {
            showError('Payment rate and minutes must be positive values.');
            return;
        }

        // --- 2. Calculate Duration in Minutes ---
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        
        // Handle cases where the experiment crosses midnight
        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        const durationMilliseconds = end - start;
        const durationMinutes = durationMilliseconds / (1000 * 60);

        if (durationMinutes <= 0) {
            showError('End time must be after start time.');
            return;
        }

        // --- 3. Calculate Payment ---
        let finalAmount;
        if (shouldRoundUp) {
            // This logic implements "round up to the next full pay interval".
            // Calculate how many payment intervals were worked (e.g., 1.5 for 90 mins at a 60-min rate).
            const numberOfIntervals = durationMinutes / rateMinutes;
            // Round UP to the next full interval (e.g., 1.5 becomes 2).
            const roundedIntervals = Math.ceil(numberOfIntervals);
            // Calculate the final amount based on the full, rounded-up intervals.
            finalAmount = roundedIntervals * rateAmount;
        } else {
            // Calculate the precise, unrounded total payment.
            const paymentPerMinute = rateAmount / rateMinutes;
            finalAmount = durationMinutes * paymentPerMinute;
        }
        
        // --- 4. Display the Result ---
        // Format to 2 decimal places for currency and display.
        paymentAmountEl.textContent = `$${finalAmount.toFixed(2)}`;
        resultDiv.classList.remove('hidden');
    });

    /**
     * Displays an error message to the user.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
});
