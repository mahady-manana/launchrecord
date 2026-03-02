import { useCallback, useEffect, useState } from "react";
import type { UserRecord, UserRole } from "@/types/user";
import { useUserStore } from "@/stores/user-store";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
}

export function useUsers() {
  const users = useUserStore((state) => state.users);
  const isLoading = useUserStore((state) => state.isLoading);
  const setUsers = useUserStore((state) => state.setUsers);
  const setIsLoading = useUserStore((state) => state.setIsLoading);
  const addUser = useUserStore((state) => state.addUser);
  const updateUserRecord = useUserStore((state) => state.updateUser);
  const removeUser = useUserStore((state) => state.removeUser);
  const reset = useUserStore((state) => state.reset);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      const result: { success: boolean; data?: { users: UserRecord[] } } =
        await response.json();
      if (response.ok && result.success && result.data?.users) {
        setUsers(result.data.users);
      } else {
        reset();
      }
    } catch {
      reset();
    } finally {
      setIsLoading(false);
    }
  }, [reset, setIsLoading, setUsers]);

  const createUser = useCallback(async (input: CreateUserInput) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result: { success: boolean; message?: string; data?: { user: UserRecord } } =
      await response.json();
    if (!response.ok || !result.success) {
      return { ok: false, error: result.message };
    }
    if (result.data?.user) {
      addUser(result.data.user);
    }
    return { ok: true };
  }, [addUser]);

  const updateUser = useCallback(async (id: string, input: UpdateUserInput) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result: { success: boolean; message?: string; data?: { user: UserRecord } } =
      await response.json();
    if (!response.ok || !result.success || !result.data?.user) {
      return { ok: false, error: result.message };
    }
    updateUserRecord(result.data.user);
    return { ok: true };
  }, [updateUserRecord]);

  const deleteUser = useCallback(async (id: string) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    const result: { success: boolean; message?: string } =
      await response.json();
    if (!response.ok || !result.success) {
      return { ok: false, error: result.message };
    }
    removeUser(id);
    return { ok: true };
  }, [removeUser]);

  return { users, isLoading, fetchUsers, createUser, updateUser, deleteUser };
}

export function useUser(id: string) {
  const [user, setUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${id}`);
      const result: { success: boolean; data?: { user: UserRecord } } =
        await response.json();
      if (response.ok && result.success && result.data?.user) {
        setUser(result.data.user);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  return { user };
}

export function useCreateUser() {
  const { createUser } = useUsers();
  return createUser;
}

export function useUpdateUser() {
  const { updateUser } = useUsers();
  return updateUser;
}

export function useDeleteUser() {
  const { deleteUser } = useUsers();
  return deleteUser;
}
