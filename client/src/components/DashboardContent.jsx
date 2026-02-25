import ContentSection from "./ContentSection";
import SearchBar from "./SearchBar";

export default function DashboardContent()
{
        const linkMap={
        trending_movies : 'http://localhost:3000/trending_movies',
        popular_movies : 'http://localhost:3000/popular_movies',
        upcoming_movies : 'http://localhost:3000/upcoming_movies',
        now_playing_movies : 'http://localhost:3000/now_playing_movies',
        top_rated_movies : 'http://localhost:3000/top_rated_movies',
        tv_airing_today : 'http://localhost:3000/tv_airing_today',
        tv_on_air : 'http://localhost:3000/tv_on_air',
        popular_tv : 'http://localhost:3000/popular_tv',
        top_rated_tv : 'http://localhost:3000/top_rated_tv',
        trending_tv : 'http://localhost:3000/trending_tv/day'
    };

    return (
        <>
            <ContentSection endpoint='trending_movies' scrollbar title={'Trending Movies'} media_type='movie'/>
            <ContentSection endpoint='upcoming_movies' title='Upcoming Movies' media_type='movie'/>
            <ContentSection endpoint='now_playing_movies' title={'Now Playing Movies'} media_type='movie'/>
            <ContentSection endpoint='popular_movies' title='Popular Movies' media_type='movie'/>
            <ContentSection endpoint='top_rated_movies' title='Top Rated Movies' media_type='movie'/>
            <ContentSection endpoint='trending_tv' scrollbar  title='Trending' media_type='tv'/>
            <ContentSection endpoint='tv_airing_today' title='Airing Today' media_type='tv'/>
            <ContentSection endpoint='tv_on_air' title='On Air' media_type='tv'/>
            <ContentSection endpoint='popular_tv' title='Popular' media_type='tv'/>
            <ContentSection endpoint='top_rated_tv' title='Top Rated' media_type='tv'/>
        </>
    );
}