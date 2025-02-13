import { Button } from "@/components/ui/button";
import { deleteCookie } from "@/lib/helper";

const Logout = () => {
  function handleLogout() {
    deleteCookie("token");
    window.location.href = "/login";
  }
  return (
    <div>
      <Button
        className="fixed top-4 right-4 sm:top-2 sm:right-2 sm:text-sm "
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Logout;
