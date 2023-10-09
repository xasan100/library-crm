import React, { useState, useMemo } from "react";
import AddTeacher from "./AddTeacher";
import EmptyBox from "../EmptyBox/EmptyBox";
import Loader from "../Loader/Loader";
import { useGetTeachersQuery } from "../../redux/slice/teachers/TeachersSlice";
import DeleteTeacher from "./DeleteTeacher";
import UpdateTeacher from "./UpdateTeacher";
import { FaUserTie } from "react-icons/fa";
import View from "./View";

const IncomeTable = ({ teacher, index }) => {
  return (
    <li className="flex justify-between gap-x-6 px-2 py-3 cursor-pointer hover:bg-gray-200">
      <div className="flex min-w-0 gap-x-4">
        <h1>{index + 1}.</h1>
        {teacher?.user.image && teacher.user.image !== "" ? (
          <img
            src={teacher.user.image}
            alt="Teacher"
            className="h-12 w-12 flex-none rounded-full border object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border bg-gray-200 flex justify-center items-center">
            <FaUserTie className="text-3xl text-primary" />
          </div>
        )}
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {teacher?.user.first_name}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {teacher?.user.last_name}
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <View object={teacher} />
        <UpdateTeacher object={teacher} />
        <DeleteTeacher ID={teacher.id} />
      </div>
    </li>
  );
};

function TeachersTableComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetTeachersQuery();

  const filteredTeachers = useMemo(() => {
    // Computing the filtered teachers list
    if (searchTerm) {
      return data.filter(
        (teacher) =>
          teacher.user.first_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          teacher.user.last_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          teacher.user.middle_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    } else {
      return data;
    }
  }, [data, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-full gap-3 col-span-12 sx:overflow-x-auto">
      <div className="rounded-lg shadow-md col-span-12 grid grid-cols-12 border h-[75vh] items-start overflow-hidden  sx:w-max">
        <div className="col-span-12 flex items-center justify-between p-3">
          <div>
            <label htmlFor="table-search" className="sr-only">
              Qidirish
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Izlash..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <AddTeacher />
        </div>
        {isLoading ? (
          <Loader
            extraClass="col-span-12 flex justify-center"
            Color="#62B238"
          />
        ) : filteredTeachers.length > 0 ? (
          <ul className="divide-y-reverse overflow-y-scroll h-[68vh] divide-gray-100 border rounded-lg col-span-12">
            {filteredTeachers.map((teacher, index) => (
              <IncomeTable teacher={teacher} index={index} key={teacher.id} />
            ))}
          </ul>
        ) : (
          <EmptyBox />
        )}
      </div>
    </div>
  );
}

export default React.memo(TeachersTableComponent);