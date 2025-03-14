import { Link } from "react-router-dom";

interface MenuItem {
  id: number;
  text: string;
  href: string;
}

interface NavigationProps {
  menuItems: MenuItem[];
}

const Navigation = ({ menuItems }: NavigationProps) => {
  return (
    <nav className="flex items-center">
      <ul className="flex items-center space-x-8 m-0">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              to={item.href} 
              className="text-gray-dark hover:text-primary 
                transition-colors py-2 font-medium"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;