import { useDispatch, useSelector } from "react-redux"
import { StateType, categoriesItem } from "../types"
import { AppDispatch } from "../redux/configStore"
import { useEffect, useState } from "react"
import { changeCategory, fetchGetData } from "../redux/shopReducer"
import Preloader from "./preloader"
import Card from "./Card"

export default function Catalog({ categories }: { categories: Array<categoriesItem> }) {
  
  const dispatch = useDispatch<AppDispatch>()
  const { items, moreItems, search } = useSelector((state: StateType) => state.shop)
  const [active, setActive] = useState(0)

  useEffect(() => {
    dispatch(fetchGetData({
      url: `/api/items?q=${search}`,
      type: 'items'
    }))
  }, [])

  useEffect(() => {
    dispatch(fetchGetData({
      url: `/api/items?q=${search}`,
      type: 'items'
    }))
  }, [search])

  function onChangeCategory(e: React.MouseEvent, id: number) {
    setActive(id)

    dispatch(changeCategory())
    e.currentTarget.closest('.catalog-categories')?.querySelectorAll('.nav-link')
      .forEach((el) => { el.classList.remove('active') })
    e.currentTarget.classList.add('active')
  }

  function onClickAll(e: React.MouseEvent) {
    onChangeCategory(e, 0)
    dispatch(fetchGetData({
      url: `/api/items?q=${search}`,
      type: 'items'
    }))
  }

  function onClickCateg(e: React.MouseEvent, id: number) {
    onChangeCategory(e, id)

    dispatch(fetchGetData({
      url: `/api/items?categoryId=${id}&q=${search}`,
      type: 'items'
    }))
  }

  function onClickMore() {
    if (active === 0) {
      dispatch(fetchGetData({
        url: `/api/items?offset=${items.data.length}&q=${search}`,
        type: 'moreItems'
      }))
    } else {
      dispatch(fetchGetData({
        url: `/api/items?categoryId=${active}&offset=${items.data.length}&q=${search}`,
        type: 'moreItems'
      }))
    }

  }

  return (
    <>
      <ul className="catalog-categories nav justify-content-center">
        <li className="nav-item">
          <p className="nav-link active" onClick={(e) => { onClickAll(e) }}>Все</p>
        </li>
        {categories.map((el) => {
          return (
            <li className="nav-item" key={el.id}>
              <p className="nav-link" onClick={(e) => { onClickCateg(e, el.id) }}>{el.title}</p>
            </li>
          )
        })}
      </ul>
      {items.isLoading ?
        <Preloader /> :
        <div className="row">
          {items.data.map((el) => {
            return <Card card={el} key={el.id} />
          })}
        </div>}

      {moreItems.isDataOver ? undefined :
        <div className="text-center">
          {moreItems.isLoading ?
            <Preloader /> :
            <button className="btn btn-outline-primary" onClick={onClickMore}>Загрузить ещё</button>
          }
        </div>}


    </>

  )
}