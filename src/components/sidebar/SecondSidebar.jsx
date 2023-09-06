import { IoMdMore } from "react-icons/io";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import menuItems from "../../mock/menu";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export function SidebarItem({
  link,
  active,
  expanded,
  setActive,
  openDropdown,
  setOpenDropdown,
  navigate,
}) {
  return (
    <li
      onClick={() => navigate(link.path)}
      className={`my-1 p-1
      font-medium rounded-md cursor-pointer
      ${
        active === link.id
          ? "bg-gradient-to-tr from-primary to-indigo-400 text-white"
          : "hover:bg-indigo-50 text-gray-600"
      }
    `}
    >
      <div
        onClick={() => {
          if (link.submenu) {
            setOpenDropdown(openDropdown === link.id ? null : link.id);
          }
          setActive(link.id);
        }}
        className="relative flex items-center py-2 px-3 group"
      >
        {link.icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {link.title}
        </span>
        {link.submenu && expanded && (
          <span className="text-2xl ml-2">
            <FiChevronDown />
          </span>
        )}
        {!expanded && (
          <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
          >
            {link.title}
          </div>
        )}
      </div>
      {openDropdown === link.id && (
        <ul
          className="p-2 flex flex-col list-none bg-white transition-all duration-200 ease-in-out overflow-hidden rounded-md"
          style={{
            maxHeight: openDropdown === link.id ? "100%" : "0px",
          }}
        >
          {link.submenu.map((sub) => (
            <li
              key={sub.id}
              onClick={(event) => {
                event.stopPropagation(); // Bu yerga qo'shildi
                navigate(sub.path);
                setActive(sub.id);
              }}
              className={`py-1 px-4
  font-medium rounded-md cursor-pointer select-none
  ${
    active === sub.id
      ? "bg-gradient-to-tr from-primary to-indigo-400 text-white"
      : "hover:bg-indigo-50 text-gray-600"
  }
`}
            >
              {sub.title}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SecondSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleResize = () => {
    if (window.innerWidth >= 1200) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  useEffect(() => {
    handleResize();
    // Oynaning kengligini kuzatib, o'zgartirish yuz berganda funksiyamizni chaqiramiz
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col justify-between bg-white border-r shadow-sm">
        <div className="pb-2 flex justify-between items-center flex-col overflow-hidden">
          <div className="p-3 flex justify-between items-center w-full">
            <img
              src={Logo}
              className={`overflow-hidden transition-all ${
                expanded ? "w-52" : "w-0"
              }`}
              alt=""
            />
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <LuChevronFirst /> : <LuChevronLast />}
            </button>
          </div>
          <ul
            className={`px-3 mt-16 ${
              open ? "overflow-y-scroll scrollbar-hide" : ""
            } select-none `}
          >
            {menuItems.map((link) => (
              <SidebarItem
                key={link.id}
                link={link}
                active={active}
                expanded={expanded}
                setActive={setActive}
                openDropdown={open}
                setOpenDropdown={setOpen}
                navigate={navigate}
              />
            ))}
          </ul>
        </div>

        <div className="border-t flex p-3 mt-20">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <IoMdMore size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}