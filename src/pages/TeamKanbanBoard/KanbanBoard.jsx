import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import TopPlate from "./TopPlate";
import NoteHeader from "../../components/common/NoteHeader";
import {useParams} from "react-router-dom";
import {
    changeKanbanBoardCardPriorty, changeKanbanBoardPriority,
    createKanbanBoardCard,
    createKanbanBoardColumn, deleteKanbanBoardCard,
    deleteKanbanBoardColumn,
    getKanbanBoardByTeamId, getTeam
} from "../../service/KanbanBoardService";
import { useRecoilValue } from 'recoil';
import {userState} from "../../recoil/UserAtoms";
import Sidebar from "../../components/common/Sidebar";
import "./KanbanBoard.css";

/**
 * KanbanBoard
 *  - 컬럼 배열을 상위에서 관리
 *  - Column을 Droppable로 묶어, 컬럼 순서도 변경 가능
 *  - onDragEnd에서 카드 이동 / 컬럼 이동 로직을 처리
 */


const KanbanBoard = ({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
}) => {
    const {teamId} = useParams();
    const [teamInfo, setTeamInfo] = useState({});
    const [columns, setColumns] = useState([]);
    const [nextColumnId, setNextColumnId] = useState(1);
    const [nextCardId, setNextCardId] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = useRecoilValue(userState);
    const userId = user.memberId;
    const userNickname = user.nickname;

    const handleMenuClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleAddColumn = async () => {
        const newColumn = {
            id: nextColumnId,
            name: `Column ${nextColumnId}`,
            cards: []
        };
        const response = await createKanbanBoardColumn(teamId, newColumn.name);
        if (response) {
            const responseColumn = {
                id: response.data.columnId,
                name: response.data.title,
                cards: []
            }
            setColumns((prevColumns) => [...prevColumns, responseColumn]);
            setNextColumnId(nextColumnId + 1);
        }
    }

    /**
     * 컬럼 삭제
     */
    const handleDeleteColumn = async (id) => {
        const response = await deleteKanbanBoardColumn(id)// 백엔드 API 호출
        console.log(id)

        if (response) { // 삭제 성공 시 상태 업데이트
            setColumns((prevColumns) => prevColumns.filter((col) => col.id !== id));
        }

    };

    /**
     * 카드 추가
     */
    const handleAddCard = async (columnId) => {
        const newCard = {
            id: nextCardId,
            title: `Card`,
            membername: userNickname,
        };
        const response = await createKanbanBoardCard(userId,teamId,newCard.title,columnId);

        if (response) {
            console.log(response);
            const responesCard = {
                id: response.data.cardId,
                title: response.data.title,
                memberNickName: response.data.memberNickname
            }
            setColumns((prevColumns) =>
                prevColumns.map((column) =>
                    column.id === columnId
                    ? { ...column, cards: [...column.cards, responesCard] }
                    : column
                )
            );
            setNextCardId(nextCardId + 1);
        }


    };
    /**
     * 카드 삭제
     */

    const handleDeleteCard = async (cardId) => {
        console.log(cardId);
        const response = await deleteKanbanBoardCard(cardId);
        if (response) {
            setColumns((prevColumns) =>
                prevColumns.map((column) => ({
                    ...column,
                    cards: column.cards.filter((card) => card.id !== cardId)
                }))
            );
        }

    };
    /**
     * 드래그 종료 시 처리
     * - type === 'column': 컬럼 순서 변경
     * - type === 'card': 카드 순서 변경(동일 컬럼 or 다른 컬럼)
     */
    const onDragEnd = async (result) => {
        const { destination, source, draggableId, type } = result;

        console.log("목적지", destination);
        console.log("id", draggableId);

        // 목적지가 없으면 취소
        if (!destination) return;

        // 제자리에 떨어진 경우 취소
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // 1) **컬럼 드래그 (type === "column")**
        if (type === "column") {
            const newColumns = Array.from(columns);
            const [movedColumn] = newColumns.splice(source.index, 1); // 기존 위치에서 제거
            newColumns.splice(destination.index, 0, movedColumn); // 새로운 위치에 추가

            setColumns(newColumns); // 상태 업데이트
            const targetBoardId = draggableId.split("column-")
            // 🚀 **API 호출 추가 (컬럼 이동 시)**
            try {
                await changeKanbanBoardPriority(Number(targetBoardId[1]), destination.index + 1, teamId);
                console.log(`Move Board : ${targetBoardId} to ${destination.index + 1}`);
            } catch (error) {
                console.error("Failed to update column priority", error);
            }

            return;
        }
        // 여기가 카드 드래그 도착 부분 !!!!!!!!!!!!!!!!!!
        // 2) **카드 드래그 (type === "card")**
        const startColIndex = columns.findIndex((col) => String(col.id) === source.droppableId);
        const endColIndex = columns.findIndex((col) => String(col.id) === destination.droppableId);

        const startCol = columns[startColIndex];
        const endCol = columns[endColIndex];

        if (startCol.id === endCol.id) {
            const targetCardId = draggableId.split("card-")

            try {
                const response = await changeKanbanBoardCardPriorty(teamId, Number(targetCardId[1]), startCol.id, destination.index+1, endCol.id);
                console.log(`Moved card: ${targetCardId} from ${startCol.id} to ${endCol.id}, position ${destination.index}`);
                setColumns(response.data.kanbanBoards);
            } catch (error) {
                console.error("Failed to update card movement", error);
            }

        } else {
            const targetCardId = draggableId.split("card-")

            try {
                const response = await changeKanbanBoardCardPriorty(teamId, Number(targetCardId[1]), startCol.id, destination.index+1, endCol.id);
                console.log(`Moved card: ${targetCardId} from ${startCol.id} to ${endCol.id}, position ${destination.index}`);
                setColumns(response.data.kanbanBoards);
            } catch (error) {
                console.error("Failed to update card movement", error);
            }
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

    useEffect(() => {
        async function fetchData1() {
            const team = await getTeam(teamId);
            console.log(team);
            console.log("이게 team 이름임",team.teamName);

            setTeamInfo(team);
        }
        fetchData1();

    }, [teamId]);

    return (
        <div className={`relative flex justify-center items-center ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="flex flex-col justify-center w-full">
                <NoteHeader
                    teamId={teamId}
                    onMenu={handleMenuClick}
                    onOpenLoginModal={openLoginModal}
                    onOpenLogoutModal={openLogoutModal}
                    onOpenAccountDeleteModal={openAccountDeleteModal}
                    onOpenNicknameModal={openNicknameModal}
                />
                <Sidebar isOpen={isSidebarOpen} onClose={handleMenuClick} />
                {/* 컬럼 추가 버튼 */}
                <TopPlate teamInfo={teamInfo.teamName} onAddColumn={handleAddColumn} />
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
                                    px-[40px] gap-5 h-[1200px] overflow-x-auto ml-6
                                    "
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {columns?.map((column, index) => (
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
