import React, { useState } from "react";
import Modal from "../../generic/Modal";
import { AiOutlineEye } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";

export default function ViewParent({ object }) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(!open);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <AiOutlineEye className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        Ko'rish
      </button>
      {open && (
        <Modal closeModal={onClose} actionType="view">
          <div className="w-[50vw] sx:w-[80vw] p-4">
            <div className="flex w-full h-full md:items-stretch md:flex-row sm:flex-col sm:items-center sx:flex-col">
              <div className="md:w-1/3 sm:w-full sx:w-full p-2 h-full">
                {/* Left column for avatar, etc. */}
                <div className="bg-white rounded-lg shadow-lg border p-4 flex items-center flex-col justify-center">
                  {object?.user.image && object?.user.image !== "" ? (
                    <img
                      src={object?.user.image}
                      alt="avatar"
                      className="mx-auto rounded-full w-40 h-40 object-cover"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full border bg-gray-200 flex justify-center items-center">
                      <FaUserTie className="text-7xl text-primary" />
                    </div>
                  )}

                  <h2 className="mt-4 text-center font-bold truncate">
                    {object?.user.first_name}
                  </h2>
                  <h2 className="mt-1.5 text-center font-bold truncate">
                    {object?.user.last_name}
                  </h2>
                </div>
              </div>
              <div className="md:w-2/3 sm:w-full sx:w-full p-2 h-full">
                <div className="bg-white rounded-lg shadow-lg border p-4">
                  <h2 className="text-xl mb-2">Barcha malumotlar</h2>
                  <p>
                    <strong>Foydalanuvchi nomi:</strong> {object.user.username}
                  </p>
                  <div>
                    <strong>Farzandlar</strong>{" "}
                    <table className="border-collapse border">
                      <thead>
                        <tr>
                          <th className="border p-2">№</th>
                          <th className="border p-2">Ismi</th>
                          <th className="border p-2">Familiyasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {object.children_dict.map((child, index) => (
                          <tr key={child.user.id}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">
                              {child.user.first_name}
                            </td>
                            <td className="border p-2">
                              {child.user.last_name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
