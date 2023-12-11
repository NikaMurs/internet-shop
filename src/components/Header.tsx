import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { setCartCount, setSearch } from "../redux/shopReducer";
import { StateType } from "../types";
import { useEffect } from "react";

export default function Header() {
    const { cartCount } = useSelector((state: StateType) => state.shop)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if (localStorage.cartItems){
            const lc = JSON.parse(localStorage.cartItems)
            dispatch(setCartCount(lc.length))
        }
    }, [])

    function isActiveFunc(isActiveElement: boolean) {
        if (isActiveElement) {
            return 'nav-link active'
        } else {
            return 'nav-link'
        }
    }

    let countClick = 0;
    function onClickSearch() {
        countClick++
        const form = document.querySelector('.form-inline') as HTMLFormElement
        form?.classList.remove('invisible')
        if (countClick === 2) {
            form.requestSubmit()
            document.querySelector('.form-inline')?.classList.add('invisible')
            countClick = 0
        }
    }

    function onSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const search = e.currentTarget.querySelector('input')?.value.trim() as string
        if (search.length > 0) {
            dispatch(setSearch(search))
            navigate('/catalog')
            e.currentTarget.reset()
            document.querySelector('.form-inline')?.classList.add('invisible')
            countClick = 0;
        }

    }

    return (
        <header className="container">
            <div className="row">
                <div className="col">
                    <nav className="navbar navbar-expand-sm navbar-light bg-light">
                        <a className="navbar-brand" href="/">
                            <img src={require('../img/header-logo.png')} alt="Bosa Noga" />
                        </a>
                        <div className="collapse navbar-collapse" id="navbarMain">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item">
                                    <NavLink to='/'
                                        className={({ isActive }) => isActiveFunc(isActive)}>
                                        Главная</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/catalog'
                                        className={({ isActive }) => isActiveFunc(isActive)}>
                                        Каталог</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/about'
                                        className={({ isActive }) => isActiveFunc(isActive)}>
                                        О магазине</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/contacts'
                                        className={({ isActive }) => isActiveFunc(isActive)}>
                                        Контакты</NavLink>
                                </li>
                            </ul>
                            <div>
                                <div className="header-controls-pics">
                                    <div data-id="search-expander" className="header-controls-pic header-controls-search" onClick={onClickSearch}></div>
                                    {/* <!-- Do programmatic navigation on click to /cart.html --> */}
                                    <Link to='/cart' className="header-controls-pic header-controls-cart">
                                        <div className={`header-controls-cart-full ${cartCount === 0 ? 'invisible' : ''}`}>{cartCount}</div>
                                        <div className="header-controls-cart-menu"></div>
                                    </Link>
                                </div>
                                <form data-id="search-form" className="header-controls-search-form form-inline invisible" onSubmit={onSubmitSearch}>
                                    <input className="form-control" name="search" placeholder="Поиск" />
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}