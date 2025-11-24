import { supabase } from "./supabase";

/**
 * Crée un groupe par défaut pour l'utilisateur courant
 * (utilisé uniquement s'il n'appartient à aucun groupe).
 */
export async function ensureDefaultGroup(): Promise<string> {
  const { data, error } = await supabase.rpc("ensure_group_for_current_user");
  if (error) throw error;
  return data as string;
}

/**
 * Retourne le group_id "actif" pour l'utilisateur :
 * - si l'utilisateur appartient déjà à un ou plusieurs groupes,
 *   on prend le plus récent (created_at le plus récent dans group_members)
 * - sinon on crée un groupe par défaut.
 */
export async function getMyGroupId(): Promise<string> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non connecté");

  const { data, error } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id)
    .limit(1);

  if (error) throw error;

  if (data && data.length > 0) {
    return data[0].group_id;
  }

  return await ensureDefaultGroup();
}
