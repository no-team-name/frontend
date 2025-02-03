import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import KanbanProfile from "./KanbanProfile";
import TrashIcon from "./TrashIcon";

const Card = ({ cardId, title, index, onDelete }) => {
    // 카드 제목 로컬 상태 & 수정 모드
    const [currentTitle, setCurrentTitle] = useState(title);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setCurrentTitle(e.target.value);
    };

    const handleInputBlur = () => {
        setIsEditing(false);
        // 필요하다면 상위 컴포넌트나 서버에 저장 로직 추가
    };

    return (
        // Draggable로 감싸줘야 Drag & Drop 대상이 됨
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
                        // 드래그 중인 카드에 스타일 추가
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
                            onBlur={handleInputBlur}
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
                            className="cursor-pointer text-gray-400"
                            onClick={() => onDelete(cardId)}
                        >
                            <TrashIcon />
                        </button>
                        <KanbanProfile />
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Card;
