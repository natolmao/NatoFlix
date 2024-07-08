function searchMovies() {
    const movieName = document.getElementById('movieName').value;
    console.log(`Searching for: ${movieName}`);
    alert(`Searching for: ${movieName}`);
}

function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
        searchMovies();
        document.getElementById('movieName').blur();
    }
}

document.getElementById('movieName').addEventListener('keypress', handleEnterKeyPress);
