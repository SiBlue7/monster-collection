import { supabase } from "../lib/supabase";

async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  } else {
    console.log("Logged out successfully");
  }
}
export default function Logout() {
  return <button onClick={handleLogout}>Logout</button>;
}
