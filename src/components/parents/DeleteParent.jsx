import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";
import Modal from "../../generic/Modal";
import { toast } from "react-toastify";
import { useDeleteParentMutation } from "../../redux/slice/parents/ParentsCrud";

export default function DeleteParent({ ID }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(!isOpen);
  const [deleteParent, { isLoading }] = useDeleteParentMutation();
  const handleDelete = async (id) => {
    try {
      await deleteParent({ id });
      toast.success("Ma'lumot o'chirildi!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Ma'lumot o'chirishda xatolik:", err);
    }
  };
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <BsTrash className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        O'chirish
      </button>
      {isOpen && (
        <Modal
          addFunc={() => handleDelete(ID)}
          closeModal={closeModal}
          loader={isLoading}
          actionType={"delete"}
        >
          <div className="py-5 px-10 sx:p-5 sx:w-[80vw]">
            <h1 className="text-2xl font-bold text-red-600 text-center">
              Ma'lumotni o'chirishga rozimisiz !!!
            </h1>
          </div>
        </Modal>
      )}
    </div>
  );
}