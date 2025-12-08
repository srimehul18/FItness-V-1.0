"use client";

import { supabase } from "../lib/supabaseClient";
import { Button } from "./ui/button";

export default function LogoutButton() {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <Button
      variant="outline"
      className="text-xs px-3 py-1 rounded-full"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
