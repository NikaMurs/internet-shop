import { useEffect, useState } from "react";
import { StateType, bannerProps, cartItemType } from "../../types"
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostData, removeItemToCart, setCartCount } from "../../redux/shopReducer";
import { AppDispatch } from "../../redux/configStore";
import Preloader from "../preloader";


export default function CartPage(props: bannerProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { postStatus } = useSelector((state: StateType) => state.shop)
    const Banner = props.children

    let totalPrice = 0;
    const [itemsList, setItemsList] = useState([])

    useEffect(()=>{
        if (localStorage.cartItems){
            setItemsList(JSON.parse(localStorage.cartItems))
        }
    }, [])

    useEffect(()=>{
        if (postStatus === 204){
            localStorage.clear()
            setItemsList([])
            dispatch(setCartCount(0))
        }
        if (postStatus === 500){
            console.log('500')
        }
    }, [postStatus])

    function onClickDelete(id: number) {
        console.log(id)
        const newLC = JSON.parse(localStorage.cartItems)
        newLC.forEach((el: cartItemType, ind: number) => {
            if (el.id === id) {
                return newLC.splice(ind, 1)
            }
        })
        localStorage.cartItems = JSON.stringify(newLC);
        dispatch(removeItemToCart())
        setItemsList(newLC)
    }

    function onSubmitForm(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        let phone = e.currentTarget.querySelector('#phone') as HTMLInputElement
        let address = e.currentTarget.querySelector('#address') as HTMLInputElement
        let agreement = e.currentTarget.querySelector('#agreement') as HTMLInputElement

        if (agreement.checked && phone.value.trim().length && address.value.trim().length){
            let obg = {
                owner: {
                    phone: phone.value,
                    address: address.value
                },
                items: JSON.parse(localStorage.cartItems)
            }
            dispatch(fetchPostData({
                url: '/api/order',
                type: 'placeOrder',
                body: obg,
            }))            
        }

    }

    return (
        <main className="container">
            <div className="row">
                <div className="col">
                    <Banner />

                    {itemsList.length > 0 ?
                        <>
                            <section className="cart">
                                <h2 className="text-center">Корзина</h2>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Название</th>
                                            <th scope="col">Размер</th>
                                            <th scope="col">Кол-во</th>
                                            <th scope="col">Стоимость</th>
                                            <th scope="col">Итого</th>
                                            <th scope="col">Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsList.map((el: cartItemType, ind: any) => {
                                            const price = el.price * el.count;
                                            totalPrice = totalPrice + price
                                            return <tr key={el.id}>
                                                <td scope="row">{ind + 1}</td>
                                                <td><Link to={`/catalog/:${el.id}`}>{el.title}</Link></td>
                                                <td>{el.size}</td>
                                                <td>{el.count}</td>
                                                <td>{`${el.price} руб.`}</td>
                                                <td>{`${el.price * el.count} руб.`}</td>
                                                <td><button className="btn btn-outline-danger btn-sm" onClick={() => { onClickDelete(el.id) }}>Удалить</button></td>
                                            </tr>
                                        })}

                                        <tr>

                                            <td colSpan={5} className="text-right">Общая стоимость</td>
                                            <td>{totalPrice}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                            <section className="order">
                                <h2 className="text-center">Оформить заказ</h2>
                                <div className="card" style={{
                                    maxWidth: '30rem',
                                    margin: '0 auto'
                                }}>
                                    <form className="card-body" onSubmit={(e)=>{onSubmitForm(e)}}>
                                        <div className="form-group">
                                            <label htmlFor="phone">Телефон</label>
                                            <input className="form-control" id="phone" placeholder="Ваш телефон" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Адрес доставки</label>
                                            <input className="form-control" id="address" placeholder="Адрес доставки" />
                                        </div>
                                        <div className="form-group form-check">
                                            <input type="checkbox" className="form-check-input" id="agreement" />
                                            <label className="form-check-label" htmlFor="agreement">Согласен с правилами доставки</label>
                                        </div>
                                        <button type="submit" className="btn btn-outline-secondary">Оформить</button>
                                    </form>
                                    {postStatus === 102 ? <Preloader /> : ''}
                                    {postStatus === 204 ? <p className="text-center">Заказ оформлен</p> : ''}
                                </div>
                            </section>
                        </>
                        :
                        <section className="cart">
                            {postStatus === 204 ? <h2 className="text-center">Заказ оформлен</h2> : 
                            <h2 className="text-center">Корзина пуста</h2>}
                        </section>}


                </div>
            </div>
        </main>
    )
}