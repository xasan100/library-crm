import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import menuItems from "../../mock/menu";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { ThemeContext, useTheme } from "../context/index.jsx";
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
      ${active === link?.id
          ? "bg-gradient-to-tr from-primary to-indigo-400 text-white"
          : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      <div
        onClick={() => {
          if (link.submenu) {
            setOpenDropdown(openDropdown === link?.id ? null : link?.id);
          }
          setActive(link?.id);
        }}
        className="relative flex items-center py-2 px-3 group"
      >
        {link.icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
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
      {openDropdown === link?.id && (
        <ul className="p-2 flex flex-col list-none bg-white overflow-hidden rounded-md">
          {link.submenu.map((sub) => (
            <li
              key={sub?.id}
              onClick={(event) => {
                event.stopPropagation(); // Bu yerga qo'shildi
                navigate(sub.path);
                setActive(sub?.id);
              }}
              className={`py-1 px-4
  font-medium rounded-md cursor-pointer select-none
  ${active === sub?.id
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
  const { profile } = useContext(ThemeContext);
  const [filterMenu, setFilterMenu] = useState([]);
  const navigate = useNavigate();

  const handleResize = () => {
    if (window.innerWidth >= 1200) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  const typeUser = profile?.user?.full_type;
  const notLink = ["/teacher-profile", "/parent-profile", "/student-profile"];

  const Finance = [
    "/sciences",
    "/classes",
    "/rooms",
    '/education',
    "/lesson-table",
    "/teachers",
    "/parents",
    "/tasks",
    "/attandance",
    "/staffs",
    "/users",
    "/teacher-profile", "/parent-profile", "/student-profile"
  ];

  const Manager = [
    "/analiytics",
    "/teacher-profile",
    "/parent-profile",
    "/student-profile"
  ];
  // TODO ADMIN PERMISSION
  useEffect(() => {
    const pathMap = {
      tasischi: menuItems.filter((e) => !notLink.includes(e.path)),
      teacher: menuItems.filter((e) => e.path === "/teacher-profile"),
      parent: menuItems.filter((e) => e.path === "/parent-profile"),
      student: menuItems.filter((e) => e.path === "/student-profile"),
      finance: menuItems.filter((e) => !Finance.includes(e.path)),
      manager: menuItems.filter((e) => !Manager.includes(e.path)),
    };

    const newMenu = pathMap[typeUser] || pathMap.student;
    setFilterMenu(newMenu);
    setActive(newMenu[0]?.id);
  }, [typeUser]);

  useEffect(() => {
    handleResize();
    // Oynaning kengligini kuzatib, o'zgartirish yuz berganda funksiyamizni chaqiramiz
    window.addEventListener("resize", handleResize);
  }, []);

  const { day } = useTheme();
  useEffect(() => {
    document.body.className = day ? "light-mode" : "dark-mode";
  }, [day]);

  const { profile: object } = useTheme();
  const logOut = (keys) => {
    keys.forEach((key) => sessionStorage.removeItem(key));
    navigate("/login");
  };
  return (
    <aside className="h-screen shadow-xl">
      <nav
        className={`h-full flex flex-col justify-between ${day ? "light-mode" : "dark-mode"
          }`}
      >
        <div className="pb-2 flex justify-between items-center flex-col overflow-hidden scrollbar-hide">
          <div className="p-3 flex justify-between items-center w-full">
            <img
              src={Logo}
              className={`overflow-hidden transition-all ${expanded ? "w-52" : "w-0"
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
          <ul className={`px-3 mt-16 overflow-y-scroll select-none `}>
            {filterMenu.map((link) => (
              <SidebarItem
                key={link?.id}
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

        {typeUser === "tasischi" || 'finance' || 'manager' || 'admin' ? (
          <div className="border-t flex p-3 mt-20">
            <img
              src={
                object?.user?.image || 'https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg'}
              alt="user"
              className="w-10 h-10 rounded-md"
            />
            <div
              className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">
                  {object?.user?.first_name || "Yo'q"}
                </h4>
                <span className="text-xs text-gray-600">
                  {object?.user?.username}
                </span>
              </div>
              <button
                onClick={() => logOut(["token", "profile"])}
                className="text-white py-2 px-3 uppercase rounded-lg bg-red-500 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Chiqish
              </button>
              {/* < size={20} /> */}
            </div>
          </div>
        ) : (
          <></>
        )}
      </nav>
    </aside>
  );
}
