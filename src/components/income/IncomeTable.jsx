import React, { useState, useMemo } from "react";
import EmptyBox from "../EmptyBox/EmptyBox";
import Loader from "../Loader/Loader";
import { BsArrowDownCircle } from "react-icons/bs";
import { useGetIncomesQuery } from "../../redux/slice/income/IncomeCrud";
import DeleteIncome from "./DeleteIncome";
import AddIncome from "./AddIncome";
import UpdateIncome from "./UpdateIncome";

const IncomeTable = ({ income, index }) => {
  const formatNumber = (value) => {
    const numberChange = new Intl.NumberFormat().format(value);
    return numberChange;
  };
  return (
    <li className="flex justify-between gap-x-6 px-2 py-3 cursor-pointer hover:bg-gray-200">
      <div className="flex w-full gap-x-4 items-center">
        <h1>{index + 1}.</h1>
        <div className="w-12 h-12 rounded-full border bg-gray-200 flex justify-center items-center">
          <BsArrowDownCircle className="text-xl text-green-500" />
        </div>
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-500 flex items-center gap-2">
            <span>{income?.student?.user?.first_name}</span>
            <span>{income?.student?.user?.last_name}</span>
          </p>
          <p className="mt-1 truncate text-sm leading-5 text-black font-bold">
            {formatNumber(income?.amount)}
          </p>
        </div>
        <div>{income.comment}</div>
      </div>
      <div className="flex gap-2 items-center">
        <UpdateIncome object={income} />
        <DeleteIncome ID={income?.id } />
      </div>
    </li>
  );
};

function TeachersTableComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetIncomesQuery();
  const filteredTeachers = useMemo(() => {
    // Computing the filtered teachers list
    if (searchTerm) {
      return data?.filter(
        (income) =>
          income?.student?.user?.first_name
            .toLowerCase()
            .includes(searchTerm?.toLowerCase()) ||
          income?.student?.user?.last_name
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          income?.student?.user?.middle_name
            .toLowerCase()
            .includes(searchTerm?.toLowerCase())
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
          <AddIncome />
        </div>
        {isLoading ? (
          <Loader
            extraClass="col-span-12 flex justify-center"
            Color="#62B238"
          />
        ) : filteredTeachers.length > 0 ? (
          <ul className="overflow-y-scroll h-[68vh] divide-gray-300 divide-y-2 border rounded-lg col-span-12">
            {filteredTeachers.map((income, index) => (
              <IncomeTable income={income} index={index} key={income?.id } />
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
