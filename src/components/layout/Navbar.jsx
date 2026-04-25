import { Menubar } from "primereact/menubar";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { useRef } from "react";
import { useAuth } from "@/services/auth/authContext";
import IconLogo from "/src/assets/icons/icon.svg"

export default function Navbar() {
  const menuRef = useRef(null);
  const { user, accesses, logout } = useAuth();

  const items = accesses.map((acc) => ({
    label: acc.nombre,
    icon: acc.icon,
    url: acc.path,
  }));

  const profileMenu = [
    { label: "Perfil", icon: "pi pi-user" },
    { label: "Configuración", icon: "pi pi-cog" },
    { separator: true },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: () => logout()
    },
  ];

  const start = <img alt="logo" src={IconLogo} height="40" className="mr-2"></img>;

  const end = (
    <div
      className="flex align-items-center gap-2 cursor-pointer"
      onClick={(e) => menuRef.current.toggle(e)}
    >
      <Avatar
        image={user?.person?.imagen || "https://preview.redd.it/3wlrfietzzq31.jpg?width=640&crop=smart&auto=webp&s=fac76e26c430a104b182b73389c5ca0d951d46d8"}
        shape="circle"
        size="large"
      />
      <div className="flex flex-column leading-tight">
        <span className="text-sm font-medium">{user?.username || "Usuario"}</span>
        <span className="text-xs text-gray-500">{user?.role || "Rol"}</span>
      </div>
      <i className="pi pi-angle-down text-gray-500 text-xs"></i>
      <Menu model={profileMenu} popup ref={menuRef} />
    </div>
  );

  return (
    <div className="">
      <Menubar
        model={items}
        start={start}
        end={end}
        className="border-noround-bottom bg-gray-100 border-1 border-none"
      />
    </div>
  );
}
