import React, { useState } from "react";
import { updateKanbanBoard } from "../../service/KanbanBoardService"; // API 함수 가져오기


const ColumnName = ({ columnId, name }) => {
    const [columnName, setColumnName] = useState(name);
    const [isEditing, setIsEditing] = useState(false);

    // 수정 완료 후 API 호출
    const saveColumnName = async () => {
        setIsEditing(false); // 수정 모드 종료
        if (columnName !== name) { // 변경이 있을 때만 API 호출
            await updateKanbanBoard(columnId, columnName);
        }
    };

    const handleInputChange = (e) => {
        setColumnName(e.target.value);
    };

    const handleInputBlur = () => {
        saveColumnName();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            saveColumnName();
        }
    };

    return (
        <div className="flex justify-center items-center min-w-[90px] max-w-fit button text-gray-700 bg-gray-300  rounded-xl hover:ring-2 hover:ring-inset hover:bg-gray-400 hover:ring-zinc-500 px-2 py-1">
            {isEditing ? (
                <input
                    type="text"
                    className="w-full text-center bg-white border border-gray-300 rounded px-2 py-1"
                    value={columnName}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}  // 포커스를 벗어나면 저장
                    onKeyDown={handleKeyDown} // 엔터를 누르면 저장
                    autoFocus
                />
            ) : (
                <p className="cursor-pointer text-lg font-semibold whitespace-nowrap" onClick={() => setIsEditing(true)}>
                {columnName}
                </p>
            )}
        </div>
    );
};

export default ColumnName;
