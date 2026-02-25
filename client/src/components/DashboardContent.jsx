import ContentSection from "./ContentSection";

export default function DashboardContent()
{
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