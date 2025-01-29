import KanbanProfile from "./KanbanProfile";
import React, { useState } from "react";
import TrashIcon from "./TrashIcon";

const Card = ({ id, title, onDelete }) => {
    // 제목 상태
    const [currentTitle, setCurrentTitle] = useState(title);
    // 수정 모드 여부
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true); // 수정 모드 활성화
    };

    const handleInputChange = (e) => {
        setCurrentTitle(e.target.value); // 제목 업데이트
    };

    const handleInputBlur = () => {
        setIsEditing(false); // 수정 모드 비활성화
    };

    return (
        <div
            className="bg-white w-[500px] flex items-center justify-between px-[40px]
            h-[110px] border-2 rounded-xl hover:ring-2 hover:ring-inset hover:ring-zinc-500"
        >

            {/*카드 제목 수정 관련 부분*/}
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


                <div className="flex justify-center items-center gap-4">
                    <button
                        className="cursor-pointer text-gray-400"
                        onClick={() => onDelete(id)}
                    >
                        <TrashIcon />
                    </button>
                    <KanbanProfile />
                </div>
        </div>
    );
};

export default Card;
