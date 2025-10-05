import CardNav from "./reactbits/CardNav";
import logo from "../assets/logo.png";

const Navbar: React.FC = () => {
  const items = [
    {
      label: "Home",
      bgColor: "rgba(255, 255, 255, 0.4)",
      textColor: "#fff",
      links: "#home",
    },
    {
      label: "Experience",
      bgColor: "rgba(255, 255, 255, 0.4)",
      textColor: "#fff",
      links: "#experience",
    },
    {
      label: "Projects",
      bgColor: "rgba(255, 255, 255, 0.4)",
      textColor: "#fff",
      links: "#projects",
    },
    {
      label: "Services",
      bgColor: "rgba(255, 255, 255, 0.4)",
      textColor: "#fff",
      links: "#services",
    },
    {
      label: "Contact",
      bgColor: "rgba(255, 255, 255, 0.4)",
      textColor: "#fff",
      links: "#contact",
    },
  ];
  return (
    <CardNav
      logo={logo}
      logoAlt="Company Logo"
      items={items}
      baseColor="#000"
      menuColor="#fff"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
};

export default Navbar;
