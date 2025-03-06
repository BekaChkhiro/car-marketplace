import { Link } from "react-router-dom";

interface LogoProps {
  text: string;
}

const Logo = ({ text }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className="text-2xl font-bold text-primary hover:opacity-90 transition-opacity"
    >
      {text}
    </Link>
  );
};

export default Logo;