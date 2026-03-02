"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import type { UserRecord, UserRole } from "@/types/user";

export default function UsersPage() {
  const { user: sessionUser } = useAuth();
  const { users, updateUser } = useUsers();
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
  });
  const [editError, setEditError] = useState<string | null>(null);

  const isAdmin = sessionUser?.role === "admin";

  const handleOpenEdit = (targetUser: UserRecord) => {
    setEditError(null);
    setEditingUser(targetUser);
    setEditForm({
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
    });
  };

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;
    setEditError(null);
    const payload = {
      name: editForm.name,
      email: editForm.email,
      ...(isAdmin ? { role: editForm.role } : {}),
    };
    const result = await updateUser(editingUser.id, payload);
    if (!result.ok) {
      setEditError(result.error || "Unable to update user.");
      return;
    }
    setEditingUser(null);
  };

  return (
    <div className="space-y-4 text-foreground">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Team</p>
        <h1 className="mt-2 text-2xl font-semibold">Users</h1>
      </div>
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-muted-foreground">{row.email}</TableCell>
                <TableCell className="text-muted-foreground">{row.role}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground"
                    disabled={!isAdmin && row.id !== sessionUser?.id}
                    onClick={() => handleOpenEdit(row)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
        title="Edit user"
        description="Update name, email, or role."
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={editForm.name}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={editForm.email}
              onChange={(event) =>
                setEditForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          {isAdmin ? (
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                value={editForm.role}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    role: event.target.value as UserRole,
                  }))
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ) : null}
          {editError ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {editError}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
