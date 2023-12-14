import { useNavigate, useParams } from "react-router-dom"
import { StateType, bannerProps, cartItemType } from "../../types"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addItemToCart, fetchGetData } from "../../redux/shopReducer"
import { AppDispatch } from "../../redux/configStore"
import Preloader from "../preloader"
import Error from '../error'

export default function ProductPage(props: bannerProps) {
    const Banner = props.children
    const dispatch = useDispatch<AppDispatch>()
    const { itemInfo } = useSelector((state: StateType) => state.shop)
    const { productID } = useParams()
    const navigate = useNavigate()

    let [count, setCount] = useState(1)
    let [sizeAvalible, setSizeAvalible] = useState('invisible')
    let [sizeSelected, setSizeSelected] = useState('')

    useEffect(() => {
        dispatch(fetchGetData({
            url: `/api/items/${productID?.replace(':', '')}`,
            type: 'itemInfo'
        }))
    }, [])

    useEffect(() => {
        if (!itemInfo.isLoading) {
            itemInfo.data.sizes.forEach((el) => {
                if (el.available) {
                    setSizeAvalible('')
                    return
                }
            })
        }
    }, [itemInfo.isLoading])


    function onClickSize(e: React.MouseEvent) {
        document.querySelectorAll('.catalog-item-size').forEach((el) => {
            el.classList.remove('selected')
        })
        e.currentTarget.classList.add('selected')
        setSizeSelected(`${e.currentTarget.textContent}`)
    }

    function onClickCountMin() {
        if (count > 1) {
            setCount(--count)
        }
    }

    function onClickCountMax() {
        if (count < 10) {
            setCount(++count)
        }
    }

    function onClickCart() {
        const item = {
            id: itemInfo.data.id,
            title: itemInfo.data.title,
            size: sizeSelected,
            price: itemInfo.data.price,
            count: count
        }

        if (localStorage.cartItems) {
            const newLC = JSON.parse(localStorage.cartItems)

            let isNew = true;
            newLC.map((el: cartItemType) => {
                if (el.id === item.id && el.size === item.size) {
                    isNew = false
                    return el.count = el.count + item.count
                }
            })

            if (isNew) {
                dispatch(addItemToCart())
                newLC.push(item)
            }
            localStorage.cartItems = JSON.stringify(newLC);
        } else {
            dispatch(addItemToCart())
            localStorage.cartItems = JSON.stringify([item])
        }

        navigate('/cart')
    }

    return (
        <main className="container">
            <div className="row">
                <div className="col">
                    <Banner />
                    {itemInfo.isLoading ?
                        <Preloader /> :
                        !itemInfo.hasError ?
                        <>
                            <section className="catalog-item">
                                <h2 className="text-center">{itemInfo.data.title}</h2>
                                <div className="row">
                                    <div className="col-5">
                                        <img src={itemInfo.data.images[0]}
                                            className="img-fluid" alt="" />
                                    </div>
                                    <div className="col-7">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td>Артикул</td>
                                                    <td>{itemInfo.data.sku}</td>
                                                </tr>
                                                <tr>
                                                    <td>Производитель</td>
                                                    <td>{itemInfo.data.manufacturer}</td>
                                                </tr>
                                                <tr>
                                                    <td>Цвет</td>
                                                    <td>{itemInfo.data.color}</td>
                                                </tr>
                                                <tr>
                                                    <td>Материалы</td>
                                                    <td>{itemInfo.data.material}</td>
                                                </tr>
                                                <tr>
                                                    <td>Сезон</td>
                                                    <td>{itemInfo.data.season}</td>
                                                </tr>
                                                <tr>
                                                    <td>Повод</td>
                                                    <td>{itemInfo.data.reason}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="text-center">
                                            <p>Размеры в наличии: {itemInfo.data.sizes.map((el) => {
                                                if (el.available) {
                                                    return <span key={el.size} onClick={onClickSize} className="catalog-item-size">{el.size}</span>
                                                }
                                            })}</p>
                                            <p className={sizeAvalible}>Количество: <span className="btn-group btn-group-sm pl-2">
                                                <button className="btn btn-secondary" onClick={onClickCountMin}>-</button>
                                                <span className="btn btn-outline-primary">{count}</span>
                                                <button className="btn btn-secondary" onClick={onClickCountMax}>+</button>
                                            </span>
                                            </p>
                                        </div>
                                        <button className={`btn btn-danger btn-block btn-lg ${sizeAvalible}`} disabled={sizeSelected ? false : true} onClick={onClickCart}>В корзину</button>
                                    </div>
                                </div>
                            </section>
                        </> :
                        <Error />
                    }

                </div>
            </div>
        </main>
    )
}