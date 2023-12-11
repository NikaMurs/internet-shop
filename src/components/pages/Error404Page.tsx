import { bannerProps } from '../../types'


export default function Error404Page(props: bannerProps) {
  const Banner = props.children

  return (
    <>
      <Banner />
      <section className="top-sales">
        <h2 className="text-center">Страница не найдена</h2>
        <p className="text-center">
          Извините, такая страница не найдена!
        </p>
      </section>
    </>
  )
}