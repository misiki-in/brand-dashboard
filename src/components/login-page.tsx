"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Gem, Eye, EyeOff, ArrowRight, Loader2, Shield } from "lucide-react";

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("info@varnijewels.com");
  const [password, setPassword] = useState("litekart");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "radial-gradient(circle, #D4A843, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-3xl"
          style={{ background: "radial-gradient(circle, #D4A843, transparent 60%)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #D4A843 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-5 shadow-lg" style={{ background: "linear-gradient(135deg, #D4A843, #B8922E)" }}>
            <Gem className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Varni Jewels</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Brand Command Center</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-xl shadow-black/[0.03] p-8">
          <div className="space-y-1 mb-6">
            <h2 className="text-lg font-semibold text-foreground">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">Access your brand dashboard and analytics</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 bg-background/60 border-border/70 text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:border-primary/40"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 bg-background/60 border-border/70 text-sm placeholder:text-muted-foreground/50 pr-11 focus-visible:ring-primary/30 focus-visible:border-primary/40"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <Shield className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Remember + Forgot (decorative) */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                onClick={() => setError("Password reset is not available in demo mode")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(
                "w-full h-11 text-sm font-semibold shadow-lg transition-all duration-200",
                "hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]",
                isLoading && "pointer-events-none"
              )}
              style={{
                background: "linear-gradient(135deg, #D4A843, #B8922E)",
                color: "white",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">or continue with</span>
            </div>
          </div>

          {/* Social Login (decorative) */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 text-sm border-border/70 hover:bg-accent/50"
              onClick={() => setError("Google SSO is not available in demo mode")}
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 text-sm border-border/70 hover:bg-accent/50"
              onClick={() => setError("Microsoft SSO is not available in demo mode")}
              disabled={isLoading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
              </svg>
              Microsoft
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-xs text-muted-foreground/60">
            Protected by enterprise-grade security
          </p>
          <p className="text-xs text-muted-foreground/40">
            &copy; 2026 Varni Jewels. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
