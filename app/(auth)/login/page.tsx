"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Box, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      return res.json();
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/20 blur-[120px]" />

      <div className="z-10 w-full max-w-md p-6">
        <div className="glass rounded-4xl p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(var(--primary)/0.4)] mb-6">
              <Box className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
              Flux<span className="text-primary text-gradient">Stock</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Manage your inventory with precision
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                variant="glass"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
              <Input
                label="Password"
                type="password"
                variant="glass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm font-semibold text-destructive animate-fade-in text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              Secure Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Trusted by modern warehouses worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
