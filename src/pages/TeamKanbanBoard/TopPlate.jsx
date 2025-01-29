import React from "react";
import AddColumn from "./AddColumn";
import KanbanProfile from "./KanbanProfile";
import TrashIcon from "./TrashIcon";

const TopPlate = ({ onAddColumn }) => {
    return (
        <div className="bg-white px-20 gap-4 flex justify-between items-center h-[80px] w-full">
            <h1 className="m-0 text-gray-600">Team: 해야하나</h1>
            <div className="flex justify-center gap-4 items-center">
                <div className="flex gap-3 justify-center items-center">
                    <KanbanProfile/>
                    <KanbanProfile/>
                    <KanbanProfile/>
                    <KanbanProfile/>
                    <KanbanProfile/>
                </div>
                {/* AddColumn 버튼 클릭 시 onAddColumn 호출 */}
                <button onClick={onAddColumn} className="cursor-pointer">
                    <AddColumn/>
                </button>

            </div>
        </div>
    );
};

export default TopPlate;
