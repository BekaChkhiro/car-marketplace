import { Link } from "react-router-dom";

interface LogoProps {
  text?: string;
}

const Logo = ({ text }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className="flex items-center hover:opacity-90 transition-opacity"
    >
      <img 
        src="/images/big-way-removebg-preview.png" 
        alt="Big Way Logo" 
        className="h-16 mr-2" 
      />
      {text && <span className="text-2xl font-bold text-primary">{text}</span>}
    </Link>
  );
};

export default Logo;