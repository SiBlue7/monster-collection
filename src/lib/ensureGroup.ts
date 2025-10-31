import { supabase } from "./supabase";

/**
 * Retourne l'ID de groupe du user courant si déjà existant.
 * Ne crée rien. Renvoie `null` s'il n'y a pas (encore) de groupe/membership.
 */
export async function getMyGroupId(): Promise<string | null> {
  // Récupère l'ID utilisateur courant depuis la session
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const userId = userData.user?.id;
  if (!userId) return null;

  // Lis la membership (policy: autorisé à voir SA ligne)
  const { data, error } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle(); // pas d'erreur si 0 ligne

  if (error) throw error;
  return data?.group_id ?? null;
}

/**
 * Garantit qu'un groupe existe pour l'utilisateur courant (auth.uid()).
 * Crée le groupe et l'entrée group_members si besoin, puis retourne l'UUID.
 * Repose sur la RPC SQL: ensure_group_for_current_user()
 */
export async function ensureDefaultGroup(): Promise<string> {
  const { data, error } = await supabase.rpc("ensure_group_for_current_user");
  if (error) throw error;
  return data as string; // gid
}

/**
 * Convenience: récupère l'ID de groupe si présent, sinon le crée.
 */
export async function getOrCreateMyGroupId(): Promise<string> {
  const existing = await getMyGroupId();
  if (existing) return existing;
  return ensureDefaultGroup();
}
