import { supabase } from "./supabase";

export const logoutUser = async (navigate) => {
  await supabase.auth.signOut();
  localStorage.removeItem("token");
  localStorage.removeItem("redirectEventId");
  navigate("/login");
};