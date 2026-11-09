import './Search.css';
import React from "react";

class Search extends React.Component {
    state =
        {
            // Инициализирую поле поиска значением из props (если передано), иначе пустой строкой
            search: this.props.initialSearch || "",
            type: "all",
            page: 1,
        };

    handleKey = (event) => {
        if (event.key === 'Enter') {
            this.props.searchMovie(this.state.search, this.state.type);
            this.setState({ page: 1 });
        }
    }

    // Исправленный handleFilter: раньше второй аргумент setState был стрелкой,
    // но setState принимал КОЛБЭК вторым аргументом, а не объект состояния
    handleFilter = (event) => {
        this.setState(
            () => ({ type: event.target.dataset.type, page: 1 }),
            () => { this.props.searchMovie(this.state.search, this.state.type, 1); }
        );
    }

    prevPage = () => {
        this.setState
            (
                () => (this.state.page > 1 ? { page: this.state.page - 1 } : { page: 1 }),
                () => { this.props.searchMovie(this.state.search, this.state.type, this.state.page) }
            )
    }

    // Переход на следующую страницу. Останавливается на последней.
    nextPage = () => {
        const itemsPerPage = 10;
        // Привожу к числу, чтобы обработать строку от API и undefined
        const totalCount = Number(this.props.totalCount) || 0;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        // Проверяю, что текущая страница меньше последней доступной
        if (this.state.page < totalPages) {
            this.setState(
                () => ({ page: this.state.page + 1 }),
                () => { this.props.searchMovie(this.state.search, this.state.type, this.state.page) }
            )
        }
    }

    setPage = (pageNumber) => {
        this.setState(
            () => ({ page: pageNumber }),
            () => (this.props.searchMovie(this.state.search, this.state.type, this.state.page))
        )
    }

    render() {
        const itemsPerPage = 10;
        const totalCount = Number(this.props.totalCount) || 0;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        // ===== ЗАДАНИЕ 2: вычисление диапазона отображаемых страниц =====
        const maxVisible = 10; // максимум кнопок страниц в диапазоне
        let startPage, endPage;

        if (totalPages <= maxVisible) {
            // Если страниц не больше 10 — показываю все
            startPage = 1;
            endPage = totalPages;
        } else {
            // Если больше 10 — показываю окно из 10 страниц
            if (this.state.page <= 5) {
                // Вначале списка — показываю первые 10
                startPage = 1;
                endPage = 10;
            } else if (this.state.page + 4 >= totalPages) {
                // Мы в конце списка — показываю последние 10
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                // Мы в середине — текущая страница примерно по центру окна
                startPage = this.state.page - 4;
                endPage = this.state.page + 5;
            }
        }

        // Формирую массив номеров ТОЛЬКО для отображаемого диапазона
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <>
                <div className="search">
                    <input
                        type="search"
                        placeholder="Поиск"
                        value={this.state.search}
                        onChange={(e) => this.setState({ search: e.target.value })}
                        onKeyUp={this.handleKey}
                    />
                    <button
                        className="btn"
                        onClick={() => {
                            this.props.searchMovie(this.state.search, this.state.type);
                            this.setState({ page: 1 });
                        }
                        }
                    >
                        &#128269;
                    </button>
                </div>

                <div className="radio">
                    <input type="radio" name="type" id="radio-all" data-type="all"
                        checked={this.state.type === 'all'} onChange={this.handleFilter} />
                    <label htmlFor="radio-all">All</label>

                    <input type="radio" name="type" id="radio-movies" data-type="movie"
                        checked={this.state.type === 'movie'} onChange={this.handleFilter} />
                    <label htmlFor="radio-movies">Movies</label>

                    <input type="radio" name="type" id="radio-series" data-type="series"
                        checked={this.state.type === 'series'} onChange={this.handleFilter} />
                    <label htmlFor="radio-series">Series</label>

                    <input type="radio" name="type" id="radio-games" data-type="game"
                        checked={this.state.type === 'game'} onChange={this.handleFilter} />
                    <label htmlFor="radio-games">Games</label>
                </div>

                <div className="pagination">
                    <button className="btn" onClick={this.prevPage}>Prev</button>

                    <div className="items">
                        {/* Показываю "1 ..." если диапазон не начинается с первой страницы */}
                        {startPage > 1 && (
                            <>
                                <button
                                    className={this.state.page === 1 ? "btn-current-page" : ""}
                                    onClick={() => this.setPage(1)}
                                >1</button>
                                {startPage > 2 && <span className="dots">…</span>}
                            </>
                        )}

                        {/* Кнопки страниц текущего диапазона */}
                        {pageNumbers.map((element) => (
                            <button
                                key={element}
                                className={element === this.state.page ? "btn-current-page" : ""}
                                onClick={() => this.setPage(element)}
                            >
                                {element}
                            </button>
                        ))}

                        {/* Показываю "... последняя" если диапазон не заканчивается последней страницей */}
                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && <span className="dots">…</span>}
                                <button
                                    className={this.state.page === totalPages ? "btn-current-page" : ""}
                                    onClick={() => this.setPage(totalPages)}
                                >{totalPages}</button>
                            </>
                        )}
                    </div>

                    <button className="btn" onClick={this.nextPage}>Next</button>
                </div>
            </>
        );
    }
}
export default Search;