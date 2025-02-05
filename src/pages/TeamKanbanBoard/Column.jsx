import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "./Card";
import PlusIcon from "./PlusIcon";
import ColumnName from "./ColumnName";
import TrashIcon from "./TrashIcon";

/**
 * Column
 *  - 컬럼 자체를 Draggable로 감싸서 컬럼 순서 변경 가능
 *  - 내부 카드 리스트를 Droppable로 설정해 카드 드롭 가능
 */
const Column = ({
                    columnId,
                    name,
                    cards = [],
                    index,
                    onDeleteColumn,
                    onAddCard,
                    onDeleteCard,
                }) => {

    const sortedCards = React.useMemo(() => {
        return [...cards].sort((a, b) => a.priority - b.priority)
    }, [cards])

    return (
        // 컬럼 자체를 Draggable로 감쌈
        <Draggable draggableId={`column-${columnId}`} index={index}>
            {(provided) => (
                <div
                    className="
                        flex flex-col items-center column py-[15px] gap-4 bg-customGray
                        w-[450px] h-[900px] rounded hover:ring-2 hover:ring-inset
                        hover:ring-zinc-500 border-2 z-1100
                        "
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    {/* 컬럼 헤더 (제목, 삭제/추가 버튼 등) */}
                    <div
                        className="flex justify-between items-center w-[350px] h-[50px]"
                        // 컬럼을 드래그하기 위해 dragHandleProps를 헤더에 부여
                        {...provided.dragHandleProps}
                    >
                        <ColumnName columnId={columnId} name={name} />
                        <div className="flex justify-center items-center gap-2">
                            {/* 컬럼 삭제 버튼 */}
                            <button
                                className="cursor-pointer text-gray-500 hover:text-gray-800 p-1"
                                onClick={() => onDeleteColumn(columnId)}
                            >
                                <TrashIcon />
                            </button>
                            {/* 카드 추가 버튼 */}
                            <button
                                onClick={() => onAddCard(columnId)}
                                className="cursor-pointer text-gray-500 hover:text-gray-800 p-1"

                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>


                    {/* 카드 리스트 영역 (Droppable) */}
                    <Droppable droppableId={String(columnId)} type="card">
                        {(provided, snapshot) => (
                            <div
                                className="flex-1 column overflow-y-auto w-[420px]"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    backgroundColor: snapshot.isDraggingOver
                                        ? "#f0f0f0"
                                        : "inherit",
                                }}
                            >
                                <div className="flex flex-col gap-4 justify-center items-center">
                                {sortedCards.map((card, cardIndex) => (
                                    <Card
                                        key={card.id}
                                        cardId={card.id} //
                                        index={cardIndex}
                                        title={card.title}
                                        membername={card.memberNickName}
                                        // 카드 삭제 시 상위로 이벤트 전달
                                        onDelete={(cardId) => onDeleteCard(cardId)}
                                    />
                                ))}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};

export default Column;
