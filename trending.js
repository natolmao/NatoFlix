async function fetchTrendingContent() {
    const apiKey = '355c7191de5cb3f569b2a6b34cc274bc';  // Replace with your actual TMDb API key
    const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
    const trendingTvUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`;
    
    try {
        const [moviesResponse, tvResponse] = await Promise.all([
            fetch(trendingMoviesUrl),
            fetch(trendingTvUrl)
        ]);

        const moviesData = await moviesResponse.json();
        const tvData = await tvResponse.json();

        return { movies: moviesData.results, tvShows: tvData.results };
    } catch (error) {
        console.error('Error fetching trending content:', error);
    }
}
