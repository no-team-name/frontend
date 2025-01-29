
import Column from "./Column";
import TopPlate from "./TopPlate";
import NoteHeader from "../../components/common/NoteHeader";
import {useState} from "react";
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";


const KanbanBoard = () => {

    const [columns, setColumns] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [incomplete, setIncomplete] = useState([]);

    const handleAddColumn = () => {
        const newColumn = {
            id: columns.length + 1,
            name: `Column ${columns.length + 1}`,
        };
        setColumns([...columns, newColumn]);
    };

    const handleDeleteColumn = (id) => {
        setColumns((prevColumns) => prevColumns.filter((Column) => Column.id !== id)); // ID로 카드 삭제
    };

    return (

            <div className="flex justify-center items-center">

                <div className="flex flex-col justify-center w-full">
                    <NoteHeader/>
                    {/* TopPlate에 컬럼 추가 핸들러 전달 */}
                    <TopPlate onAddColumn={handleAddColumn}/>


                        <div
                            className="bg-white w-full flex justify-start items-start px-[40px] gap-5 h-[1000px] overflow-x-auto"
                        >

                            {columns.map((column) => (

                                <Column
                                    key={column.id}
                                    id={column.id}
                                    name={column.name}
                                    onDelete={handleDeleteColumn}

                                />
                            ))}

                        </div>

                </div>
            </div>


    );
};

export default KanbanBoard;