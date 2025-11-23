import { supabase } from "../lib/supabase";

export async function joinGroupWithCode(code: string) {
  const { data, error } = await supabase.rpc("join_group_with_code", {
    p_code: code,
  });
  if (error) throw error;
  return data as string;
}
