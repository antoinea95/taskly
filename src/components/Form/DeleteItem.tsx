import { useState } from "react"
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Modal } from "../ui/Modal";


export const DeleteItem = ({name, isText, handleDelete} : {name: string, isText: boolean, handleDelete: () => void}) => {

    const [confirm, setConfirm] = useState(false);


    return (
        <Modal isModalOpen={confirm} setIsModalOpen={setConfirm}>
             <Button
             className={`w-fit h-fit px-3 rounded-xl bg-transparent text-black flex gap-2 shadow-none border-none hover:bg-red-500 hover:text-white ${isText ? "w-full max-w-60 bg-red-50 py-3" : ""}`}
           >
             <Trash size={16} /> {isText ? `Delete ${name}` : null}
           </Button>
           <div className="flex flex-col gap-3 items-center font-bold">
            <p>Are your sure you want to delete this {name} ?</p>
            <div className="flex w-3/4 m-auto  items-center gap-10">
                <Button onClick={handleDelete} className="bg-green-100 text-black border-none shadow-none w-full hover:bg-green-500 hover:text-white">Yes</Button>
                <Button onClick={() => setConfirm(false)}className="bg-red-100 text-black border-none shadow-none w-full hover:bg-red-500 hover:text-white">No</Button>
            </div>
            </div>
        </Modal>

    )
}