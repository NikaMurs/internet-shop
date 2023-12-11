import { useDispatch, useSelector } from 'react-redux'
import { StateType, bannerProps } from '../../types'
import Catalog from '../Catalog'
import { AppDispatch } from '../../redux/configStore'
import { useEffect } from 'react'
import { fetchGetData, setSearch } from '../../redux/shopReducer'

export default function CatalogPage(props: bannerProps) {
  const dispatch = useDispatch<AppDispatch>()
  const Banner = props.children
  const { categories, search } = useSelector((state: StateType) => state.shop)

  useEffect(() => {
    dispatch(fetchGetData({
      url: '/api/categories',
      type: 'categories'
    }))
  }, [])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search');
    dispatch(setSearch(search))
  }

  return (
    <main className="container">
      <div className="row">
        <div className="col">
          <Banner />
          <section className="catalog">
            <h2 className="text-center">Каталог</h2>

            <form className="catalog-search-form form-inline" onSubmit={onSubmit}>
              <input className="form-control" name='search' defaultValue={search} placeholder="Поиск" />
            </form>

            <Catalog categories={categories.data}/>
          </section>
        </div>
      </div>
    </main>
  )
}