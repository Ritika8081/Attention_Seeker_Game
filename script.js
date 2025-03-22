// Handle Start Button Click
document.getElementById("startGame").addEventListener("click", function() {
    window.location.href = "index.html"; // Redirect to the game page
});

// Handle Exit Button Click
document.getElementById("exitGame").addEventListener("click", function() {
    window.close(); // Attempt to close the window (may not work on all browsers)
});
