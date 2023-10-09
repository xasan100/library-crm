import React, { useState } from "react";
import {  AiOutlineUserAdd } from "react-icons/ai";
import Modal from "../../generic/Modal";
import { toast } from "react-toastify";
import { useCreateStudentClassMutation } from "../../redux/slice/studentsClas/studentsClas.js";
import { useGetTeachersQuery } from "../../redux/slice/teachers/TeachersSlice.js";

export function AddStudentClas() {
  const [open, setOpen] = useState(false); // Fixed the typo here
  const [createStudent, { isLoading, isSuccess }] = useCreateStudentClassMutation();
  const { data: teacherData, isLoading: isLoadingTeacher } = useGetTeachersQuery();
  const [inputValue, setInputValue] = useState({
    title: "",
    teacher: "",
  });
  console.log(inputValue,'inputValue');
  const addData = async () => {
    const formData = new FormData();
    formData.append('title', inputValue.title);
    formData.append('teacher', inputValue.teacher);
    try {
      await createStudent(formData).unwrap();
      toast.success(`Sinf  qo'shildi`);
      setOpen(false);
    } catch (error) {
      toast.error("Sinf Qushilmadi");
      console.error('Failed to add student:', error);
    }
  }
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="col-span-4">
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <AiOutlineUserAdd
          className="-ml-0.5 mr-1.5 text-xl"
          aria-hidden="true"
        />
        Sinf Qo'shish
      </button>
      {open && (
        <Modal
          loader={isLoading}
          closeModal={onClose} addFunc={addData}
          title={<h1>Sinf Qo'shish</h1>}>

          <div className="">
            <div className="grid gap-3 grid-cols-2">
              <input
                id="middle-name"
                name="middle_name"
                type="text"
                autoComplete="middle-name"
                required
                onChange={(e) =>
                  setInputValue({ ...inputValue, title: e.target.value })
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <select
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) =>
                setInputValue({
                  ...inputValue,
                  teacher: e.target.value,
                }
                )
              }
              >
                <option value="null">Hech biri</option>
                {teacherData?.map((val) => {
                  return (
                    <option value={val.user.id}>{val.user.first_name}</option>
                  )
                })}
              </select>
            </div>


          </div>
        </Modal>
      )}
    </div>
  );
}

export default AddStudentClas