import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import TopPlate from "./TopPlate";
import NoteHeader from "../../components/common/NoteHeader";
import {useParams} from "react-router-dom";
import {
    createKanbanBoardColumn,
    deleteKanbanBoardColumn,
    getKanbanBoardByTeamId
} from "../../service/KanbanBoardService";

/**
 * KanbanBoard
 *  - 컬럼 배열을 상위에서 관리
 *  - Column을 Droppable로 묶어, 컬럼 순서도 변경 가능
 *  - onDragEnd에서 카드 이동 / 컬럼 이동 로직을 처리
 */


const KanbanBoard = () => {
    const {teamId} = useParams();
    const [columns, setColumns] = useState([]);
    // ID 자동 증가용
    const [nextColumnId, setNextColumnId] = useState(1);
    const [nextCardId, setNextCardId] = useState(1);

    /**
     * 컬럼 추가
     */
    const handleAddColumn = async () => {
        const newColumn = {
            name: `untitled column`
        };
        const response = await createKanbanBoardColumn(teamId, newColumn.name);
        // id, name, cards
        //setColumns((prev) => [...prev, newColumn]);
    };

    /**
     * 컬럼 삭제
     */
    const handleDeleteColumn = async (id) => {
        const response = await deleteKanbanBoardColumn(id)// 백엔드 API 호출
        console.log(id)

        if (response) { // 삭제 성공 시 상태 업데이트
            setColumns((prevColumns) => prevColumns.filter((col) => col.id !== id));
        } else {
            console.error("컬럼 삭제 실패");
        }

    };

    /**
     * 카드 추가
     */
    const handleAddCard = (columnId) => {
        const newCard = {
            id: nextCardId,
            title: `Card ${nextCardId}`,
        };
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === columnId
                    ? { ...col, cards: [...col.cards, newCard] }
                    : col
            )
        );
        setNextCardId((prev) => prev + 1);
    };

    /**
     * 카드 삭제
     */
    const handleDeleteCard = (columnId, cardId) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === columnId
                    ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
                    : col
            )
        );
    };

    /**
     * 드래그 종료 시 처리
     * - type === 'column': 컬럼 순서 변경
     * - type === 'card': 카드 순서 변경(동일 컬럼 or 다른 컬럼)
     */
    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        // 목적지가 없으면 취소
        if (!destination) return;

        // 제자리에 떨어진 경우 취소
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // 1) 컬럼 드래그 (type === 'column')
        if (type === "column") {
            const newColumns = Array.from(columns);
            // source.index 위치에서 하나 제거
            const [moved] = newColumns.splice(source.index, 1);
            // destination.index 위치에 삽입
            newColumns.splice(destination.index, 0, moved);
            setColumns(newColumns);
            return;
        }

        // 2) 카드 드래그 (type === 'card')
        const startColIndex = columns.findIndex(
            (col) => String(col.id) === source.droppableId
        );
        const endColIndex = columns.findIndex(
            (col) => String(col.id) === destination.droppableId
        );

        const startCol = columns[startColIndex];
        const endCol = columns[endColIndex];

        // 출발/도착 컬럼이 같은 경우 => 순서만 변경
        if (startCol.id === endCol.id) {
            const newCards = Array.from(startCol.cards);
            // source.index에서 카드 꺼내기
            const [movedCard] = newCards.splice(source.index, 1);
            // destination.index에 삽입
            newCards.splice(destination.index, 0, movedCard);

            const updatedCol = { ...startCol, cards: newCards };
            const newColumns = Array.from(columns);
            newColumns[startColIndex] = updatedCol;
            setColumns(newColumns);
        } else {
            // 다른 컬럼으로 이동
            const startCards = Array.from(startCol.cards);
            const [movedCard] = startCards.splice(source.index, 1);

            const endCards = Array.from(endCol.cards);
            endCards.splice(destination.index, 0, movedCard);

            const newStartCol = { ...startCol, cards: startCards };
            const newEndCol = { ...endCol, cards: endCards };

            const newColumns = Array.from(columns);
            newColumns[startColIndex] = newStartCol;
            newColumns[endColIndex] = newEndCol;
            setColumns(newColumns);
        }
    };
    //
    //화면이 처음에 시작 되면 바로 작동 되는 함수
    useEffect(() => {
        async function fetchData() {
            const response = await getKanbanBoardByTeamId(teamId);
            console.log(response);
            setColumns(response.kanbanBoards);
        }
        fetchData();

    }, [teamId]);


    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center w-full">
                <NoteHeader />
                {/* 컬럼 추가 버튼 */}
                <TopPlate onAddColumn={handleAddColumn} />

                {/*
          DragDropContext: 전체 드래그 앤 드롭 컨텍스트
          Droppable: 컬럼들을 드롭할 공간 (direction="horizontal")
          type="column": 컬럼 드래그 시 사용
        */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId="all-columns"
                        direction="horizontal"
                        type="column"
                    >
                        {(provided) => (
                            <div
                                className="
                  bg-white w-full flex justify-start items-start
                  px-[40px] gap-5 h-[1000px] overflow-x-auto
                "
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {columns.map((column, index) => (
                                    <Column
                                        key={column.id}
                                        columnId={column.id}
                                        name={column.name}
                                        cards={column.cards}
                                        index={index}
                                        onDeleteColumn={handleDeleteColumn}
                                        onAddCard={handleAddCard}
                                        onDeleteCard={handleDeleteCard}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default KanbanBoard;
