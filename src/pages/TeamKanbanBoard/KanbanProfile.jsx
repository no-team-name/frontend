const KanbanProfile = ({member}) => {

    return (
        <div className="flex justify-center items-center bg-pink-200 h-[40px] x-[40px] rounded-full">
            <p className="text-xs">
                {member}
            </p>
        </div>
    )

};
export default KanbanProfile;