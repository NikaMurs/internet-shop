import { useNavigate } from "react-router-dom"
import { cardProps } from "../types"


export default function Card({ card }: { card: cardProps }) {
    const navigate = useNavigate()

    function onClick(){
        navigate(`/catalog/:${card.id}`)
    }

    return (
        <div className="col-4">
            <div className="card" onClick={onClick}>
                <img src={card.images[0]}
                    className="card-img-top img-fluid" alt={card.title} />
                <div className="card-body">
                    <p className="card-text">{card.title}</p>
                    <p className="card-text">{card.price} руб.</p>
                    <p onClick={onClick} className="btn btn-outline-primary">Заказать</p>
                </div>
            </div>
        </div>
    )
}