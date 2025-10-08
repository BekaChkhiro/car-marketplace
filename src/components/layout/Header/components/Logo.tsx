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
      <picture>
        <source srcSet="/images/logo-optimized.webp" type="image/webp" />
        <img
          src="/images/logo-optimized.png"
          alt="Big Way Logo"
          className="h-16 mr-2"
          width="64"
          height="64"
        />
      </picture>
      <span className="text-2xl font-bold text-primary">autovend.ge</span>
      {text && <span className="text-2xl font-bold text-primary">autovend.ge</span>}
    </Link>
  );
};

export default Logo;