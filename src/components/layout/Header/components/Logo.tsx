interface LogoProps {
  text: string;
}

const Logo = ({ text }: LogoProps) => {
  return (
    <a 
      href="/" 
      className="text-2xl font-bold text-primary hover:opacity-90 transition-opacity"
    >
      {text}
    </a>
  );
};

export default Logo;