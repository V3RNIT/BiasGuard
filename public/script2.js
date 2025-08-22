const form = document.getElementById("paymentForm");
const overlay = document.getElementById("overlay");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Show overlay
  overlay.style.display = "flex";

  // Simulate processing delay
  setTimeout(() => {
    overlay.innerHTML = "<h2>✅ Payment Successful!</h2>";
  }, 3000);
});
