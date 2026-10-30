import "./Main.css";
import React from "react";
import Preloader from "../components/Preloader";
import MovieList from "../components/MovieList";
import Search from "../components/Search.js";


class Main extends React.Component
{

    state =
    {
        movies:[]
    }
    


    componentDidMount()
    {
        fetch('http://www.omdbapi.com/?s=matrix&apikey=bae95fb')
            .then(response => response.json())
            .then(data => this.setState({ movies: data.Search }));
    }

    SearchMovie = (str) =>
    {
        fetch(`http://www.omdbapi.com/?s=${str}&apikey=bae95fb`)
            .then(response => response.json())
            .then(data => this.setState({ movies: data.Search }));
    }

    render()
    {
        return (
            <div className="main">
                <Search SearchMovie={ this.searchMovie } />
                {
                    this.state.movies.length == 0 ? <Preloader /> :
                    <MovieList movies={ this.state.movies } />
                }
            </div>
        )
    }
}
export default Main;