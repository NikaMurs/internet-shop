import React, { useEffect } from 'react'
import { bannerProps } from '../../types'
import Card from '../Card'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../../types'
import Preloader from '../preloader'
import Error from '../error'
import { fetchGetData, setSearch } from '../../redux/shopReducer'
import { AppDispatch } from '../../redux/configStore'
import Catalog from '../Catalog'

export default function MainPage(props: bannerProps) {
    const dispatch = useDispatch<AppDispatch>()
    const Banner = props.children
    const { topSales, categories } = useSelector((state: StateType) => state.shop)

    useEffect(() => {
        dispatch(fetchGetData({
            url: '/api/top-sales',
            type: 'topSales'
        }))
        dispatch(fetchGetData({
            url: '/api/categories',
            type: 'categories'
        }))
        dispatch(setSearch(''))
    }, [])

    return (
        <main className="container">
            <div className="row">
                <div className="col">
                    <Banner />
                    <section className="top-sales">
                        <h2 className="text-center">Хиты продаж!</h2>
                        {(topSales.isLoading) ?
                            <Preloader /> :
                            !topSales.hasError ?
                                <div className="row">
                                    {topSales.data.map((el) => {
                                        return <Card card={el} key={el.id} />
                                    })}
                                </div> :
                                <Error />
                        }
                    </section>
                    <section className="catalog">
                        <h2 className="text-center">Каталог</h2>
                        {categories.isLoading ?
                            <Preloader /> :
                            !categories.hasError ?
                                <Catalog categories={categories.data} /> :
                                <Error />
                        }

                    </section>
                </div>
            </div>
        </main>
    )
}