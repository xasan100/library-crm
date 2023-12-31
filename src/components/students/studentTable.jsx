import React, { useState, useMemo, useContext, useEffect } from "react";
import EmptyBox from "../EmptyBox/EmptyBox";
import Loader from "../Loader/Loader";
import { FaUserTie } from "react-icons/fa";
import DeleteStudent from "./DeleteStudents.jsx";
import AddStudent from "./AddStudent.jsx"
import { useGetStudentsQuery } from "../../redux/slice/students/students.js";
import View from "./View.jsx";
import UpdateStudent from "./UpdateStudent.jsx";
import StudentPay from "./StudentPay.jsx";
import DebtesCom from "./Debtes.jsx";
import { ThemeContext } from "../context/index.jsx";
import { baseUrl } from "../../api/Api.jsx";


const TeacherItem = ({ teacher, index, onStatusChange }) => {
  const { profile } = useContext(ThemeContext);
  const [status, setStatus] = useState({
    is_active: teacher.user.is_active,
    id: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(`${baseUrl}users/${status.id}/change_status/?status=${status.is_active}`);
        onStatusChange();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (status?.is_active !== teacher.user.is_active) fetchData();
  }, [status.is_active, teacher.user.is_active, status.id, onStatusChange]);

  return (
    <li className="flex justify-between gap-x-6 px-2 py-3 cursor-pointer hover:bg-gray-200">
      <div className="flex min-w-0 gap-x-4">
        <h1>{index + 1}.</h1>
        {teacher?.user?.image && teacher?.user?.image !== "" ? (
          <img
            src={teacher?.user?.image}
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
            {teacher?.user?.first_name}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {teacher?.user?.last_name}
          </p>
        </div>
        <div class="flex items-center">
          <input
            checked={status.is_active}
            onChange={() =>
              setStatus({
                ...status,
                is_active: !status.is_active,
                id: teacher.id,
              })
            }
            id={teacher.id}
            type="checkbox"
            value={status.is_active}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />

          <label
            htmlFor={teacher.id}
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {status.is_active ? <p className=" text-green-700">Status</p> : <p className="text-red-600">Status</p>}
          </label>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <View object={teacher} />
        {['Tasischi', 'Finance'].includes(profile.type_dict.title) ? < StudentPay ID={teacher?.id} /> : ''}
        {['Manager', 'Admin', 'Tasischi'].includes(profile.type_dict.title) ? < UpdateStudent object={teacher} /> : ''}
        {['Tasischi', 'Finance'].includes(profile.type_dict.title) ? < DebtesCom ID={teacher?.id} /> : ''}
        {['Manager', 'Admin', 'Tasischi'].includes(profile.type_dict.title) ? < DeleteStudent ID={teacher?.id} /> : ''}
      </div>
    </li>
  );
};

function TeachersTableComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, refetch } = useGetStudentsQuery();

  const filteredTeachers = useMemo(() => {
    if (searchTerm) {
      return data?.filter(
        (teacher) =>
          teacher?.user?.last_name.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          teacher?.user?.middle_name.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    } else {
      return data;
    }
  }, [data, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };



  return (
    <div className="h-ful gap-3 col-span-12">
      <div className="rounded-lg shadow-md col-span-12 grid grid-cols-12 border h-[75vh] items-start overflow-hidden">
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
          <AddStudent />
        </div>
        {isLoading ? (
          <Loader
            extraClass="col-span-12 flex justify-center"
            Color="#62B238"
          />
        ) : filteredTeachers?.length > 0 ? (
          <ul className="divide-y-reverse overflow-y-scroll h-[68vh] divide-gray-100 border rounded-lg col-span-12">
            {filteredTeachers?.map((teacher, index) => (
              <TeacherItem teacher={teacher} index={index} key={teacher.id} onStatusChange={refetch} />
            ))}
          </ul>
        ) : (
          <EmptyBox />
        )}
      </div>
    </div>
  );
}

export default TeachersTableComponent;
