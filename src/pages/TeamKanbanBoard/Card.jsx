import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import KanbanProfile from "./KanbanProfile";
import TrashIcon from "./TrashIcon";
import { updateKanbanBoardCard } from "../../service/KanbanBoardService"; // API 함수 import

const Card = ({ cardId, title, index, user ,onDelete ,membername}) => {
    // 카드 제목 로컬 상태 & 수정 모드
    const [currentTitle, setCurrentTitle] = useState(title);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setCurrentTitle(e.target.value);
    };

    // **수정 완료 후 API 호출**
    const saveCardTitle = async () => {
        setIsEditing(false); // 수정 모드 종료
        if (currentTitle !== title) { // 기존 제목과 다를 때만 API 호출
            await updateKanbanBoardCard(cardId, currentTitle);
        }
    };

    const handleInputBlur = () => {
        saveCardTitle();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            saveCardTitle();
        }
    };

    return (
        <Draggable draggableId={`card-${cardId}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="
                        bg-white w-[500px] flex items-center justify-between px-[40px]
                        h-[110px] border-2 rounded-xl hover:ring-2 hover:ring-inset
                        hover:ring-zinc-500
                    "
                    style={{
                        backgroundColor: snapshot.isDragging ? "lightgray" : "white",
                        ...provided.draggableProps.style,
                    }}
                >
                    {/* 카드 제목 (수정 가능) */}
                    {isEditing ? (
                        <input
                            type="text"
                            className="text-xl font-medium text-gray-900 mb-0 border border-gray-300 rounded px-2"
                            value={currentTitle}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}  // ✅ 포커스를 벗어나면 저장
                            onKeyDown={handleKeyDown} // ✅ 엔터를 누르면 저장
                            autoFocus
                        />
                    ) : (
                        <p
                            className="text-xl font-medium text-gray-900 mb-0 cursor-pointer"
                            onClick={handleEditClick}
                        >
                            {currentTitle}
                        </p>
                    )}

                    {/* 우측 아이콘(삭제 / 프로필) */}
                    <div className="flex justify-center items-center gap-4">
                        <button
                            className="cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => onDelete(cardId)}
                        >
                            <TrashIcon />
                        </button>
                        <KanbanProfile member={membername}/>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Card;
