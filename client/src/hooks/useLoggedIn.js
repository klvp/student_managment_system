import { getCookie } from "@/lib/helper";
import { useEffect } from "react";

export default function useLoggedIn() {
    useEffect(() => {
        if (!getCookie("token")) {
            window.location.href = "/login";
        }
    })
}