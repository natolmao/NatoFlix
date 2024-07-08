// Function to be called when the Search button is clicked or Enter key is pressed
function searchMovies() {
    const movieName = document.getElementById('movieName').value;
    console.log(`Searching for: ${movieName}`);
    // Add your search logic here
    alert(`Searching for: ${movieName}`);
    // Unfocus the input field
    document.getElementById('movieName').blur();
}

// Function to handle the Enter key press
function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
}

// Add event listener to the input field
document.getElementById('movieName').addEventListener('keypress', handleEnterKeyPress);
