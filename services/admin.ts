import {
  AddForUser,
  GetAll,
  GetUserPermissions,
  RemoveForUser,
} from "$repositories/permissions";

export async function AddAllPermissionsForUser(user_id: string) {
  const permissions = await GetAll();
  const user_permissions = await GetUserPermissions(user_id);

  for (const permission of permissions) {
    if (!user_permissions.includes(permission.name))
      await AddForUser(user_id, permission.id);
  }
}

export async function RemoveAllPermissionsForUser(user_id: string) {
  const permissions = await GetAll();
  const user_permissions = await GetUserPermissions(user_id);

  for (const permission of permissions) {
    if (user_permissions.includes(permission.name))
      await RemoveForUser(user_id, permission.id);
  }
}
