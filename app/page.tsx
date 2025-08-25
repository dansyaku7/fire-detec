"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("superadmin@firedetec.com");
  const [password, setPassword] = useState("superadmin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Latar Belakang Gradien dan Bentuk Abstrak (untuk seluruh halaman) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50 to-red-100 z-0"></div>
      <div className="absolute -top-40 -right-20 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Panel Kiri: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShieldAlert className="h-12 w-12 text-red-500" />
              <h1 className="text-3xl font-bold ml-3 text-gray-800">
                FireDetec
              </h1>
            </div>
            <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-10 bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-10 bg-white"
                  />
                </div>
              </div>
              
              {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
              
              <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-base font-semibold" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Log In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Panel Kanan: Ilustrasi */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 z-10">
        <div className="text-center">
          <ShieldAlert className="h-48 w-48 mx-auto text-red-500 opacity-80" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-gray-800 mt-6">
            Advanced Fire Detection
          </h2>
          <p className="text-gray-600 mt-2 max-w-sm mx-auto">
            Your advanced safety partner, providing real-time monitoring and instant alerts.
          </p>
        </div>
      </div>
    </main>
  );
}
