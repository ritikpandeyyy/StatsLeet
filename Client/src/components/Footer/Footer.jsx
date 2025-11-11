import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex text-xs sm:text-base justify-center items-center m-2 space-x-1">
      Developed with <Heart className="mx-1 w-4 sm:w-6" /> by <a href="https://www.github.com/yashasvisxena" target="_blank" className="underline underline-offset-4" rel="noreferrer">Yashasvi Saxena</a>
    </div>
  );
};

export default Footer;