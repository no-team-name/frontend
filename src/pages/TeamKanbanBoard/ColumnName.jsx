import React, { useState } from "react";

const ColumnName = () => {
    const [name, setName] = useState("Column"); // 컬럼 이름 상태
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부

    const handleEditClick = () => {
        setIsEditing(true); // 수정 모드 활성화
    };

    const handleInputChange = (e) => {
        setName(e.target.value); // 컬럼 이름 업데이트
    };

    const handleInputBlur = () => {
        setIsEditing(false); // 수정 모드 비활성화
    };

    return (
        <div
            className="flex justify-center items-center w-[90px] bg-cyan-200 rounded-2xl hover:ring-2 hover:ring-inset hover:ring-zinc-500"
        >
            {isEditing ? (
                <input
                    type="text"
                    className="w-full text-center bg-white border border-gray-300 rounded px-2 py-1"
                    value={name}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur} // 포커스가 벗어날 때 수정 모드 종료
                    autoFocus // 자동 포커스
                />
            ) : (
                <p
                    className="cursor-pointer text-sm font-medium"
                    onClick={handleEditClick} // 클릭하면 수정 모드로 전환
                >
                    {name}
                </p>
            )}
        </div>
    );
};

export default ColumnName;
