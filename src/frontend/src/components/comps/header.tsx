import { PanelsTopLeft, PlusIcon } from "lucide-react";
import { ModeToggle } from "../ui/mode-toggle";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="py-4 px-6 flex items-center border-b sticky top-0 bg-card z-10 ">
      <Link to={`/`} className="flex items-center gap-4 cursor-pointer">
        <PanelsTopLeft className="w-6 h-6" />
        <h1 className="text-2xl font-bold dark:text">Maven Studio</h1>
      </Link>
      <div className="ml-auto flex justify-center items-center gap-4">
        <Link
          to="/summary"
          className="cursor-pointer text-base underline-offset-2 underline"
        >
          Summary
        </Link>
        <ModeToggle />
        <Button variant="secondary">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Query
        </Button>
      </div>
    </header>
  );
};

export default Header;
