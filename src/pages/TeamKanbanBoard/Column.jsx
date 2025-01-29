import React, { useState } from "react";
import Card from "./Card";
import PlusIcon from "./PlusIcon";
import ColumnName from "./ColumnName";
import TrashIcon from "./TrashIcon";
import { Droppable } from "react-beautiful-dnd";

const Column = ({id, name, onDelete }) => {
    const [currentName, setCurrentName] = useState(name);
    const [cards, setCards] = useState([]);
    const [nextId, setNextId] = useState(1); // 고유 ID 생성기

    const handleAddCard = () => {
        const newCard = {
            id: nextId,
            title: `Card ${nextId}`,
        };
        setCards([...cards, newCard]);
        setNextId(nextId + 1); // 다음 ID 준비
    };

    const handleDeleteCard = (id) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== id)); // ID로 카드 삭제
    };

    return (
        <div
            className="flex flex-col items-center column py-[15px] gap-4 bg-customGray w-[550px] h-[980px] rounded hover:ring-2 hover:ring-inset hover:ring-zinc-500 border-2"
        >
            <div className="flex justify-between items-center w-[460px] h-[50px]">
                <ColumnName />
                <div className="flex justify-center items-center gap-5">
                    <button
                        className="cursor-pointer text-gray-400"
                        onClick={() => onDelete(id)}
                    >
                        <TrashIcon/>
                    </button>

                    <button onClick={handleAddCard} className="cursor-pointer">
                        <PlusIcon/>
                    </button>

                </div>

            </div>


            <div className="flex-1 column overflow-y-auto">
                {cards.map((card) => (
                    <Card
                        key={card.id} // React가 중복되지 않은 key로 관리
                        id={card.id}
                        title={card.title}
                        onDelete={handleDeleteCard}
                    />
                ))}
            </div>


        </div>
    );
};

export default Column;

