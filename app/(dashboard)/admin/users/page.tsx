"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF" as "ADMIN" | "STAFF",
  });
  const [isCreating, setIsCreating] = useState(false);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        if (res.status === 403) throw new Error("Access Denied: Admin Only");
        throw new Error("Failed to fetch users");
      }
      return res.json();
    },
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setFormData({ name: "", email: "", password: "", role: "STAFF" });
      setIsCreating(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error)
    return (
      <div className="text-red-500 font-bold p-4 border border-red-200 bg-red-50 rounded-lg">
        {error.message}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Manage Staff</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? "Cancel" : "+ Add Staff"}
        </Button>
      </div>

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="p-6 border border-border rounded-xl bg-card shadow-sm space-y-4"
        >
          <h3 className="font-semibold text-foreground">Add New Staff</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">
                Role
              </label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={createMutation.isPending}>
              Add Staff
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Staff Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Date Added
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-foreground">
                    {user.name || "N/A"}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-600"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
