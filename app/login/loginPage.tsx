"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signInWithEmail,signInSocial } from "@/actions/auth-actions";
export default function LoginPage() {
    const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmail(email, password);
      if (!result?.user) {
        console.error("Login failed", result);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };



  const handleSignInSocial = async (provider: "github") => {
    try {
      await signInSocial(provider);
    } catch (error) {
      setError(
        `Error authenticating with ${provider}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
    
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#0B0D10] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-[#13161C] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-80" />

        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-xl font-extrabold uppercase text-white tracking-wide">
            Welcome Back
          </h1>
          <p className="text-[#8E8E93] text-sm mt-1">
            Sign in to access your orders & stack
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-6">

          <Button
            type="button"
            onClick={() => handleSignInSocial("github")}
            className="w-full h-12 bg-[#0B0D10] hover:bg-[#181c24] text-white font-bold border border-white/10 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="text-sm tracking-wider">Continue with GitHub</span>
          </Button>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="w-full border-t border-white/10" />
          <span className="bg-[#13161C] px-3 text-xs font-bold uppercase tracking-widest text-[#8E8E93] absolute">
            Or Sign In With Email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-2">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 absolute left-4 text-[#8E8E93]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@heavyfuel.com"
                className="w-full h-12 bg-[#0B0D10] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#8E8E93] hover:text-[#CCFF00] transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-4 text-[#8E8E93]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 bg-[#0B0D10] border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#CCFF00] transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 bg-[#CCFF00] text-black font-black uppercase tracking-wider text-base rounded-xl hover:bg-[#b3e600] transition-all hover:scale-[1.01] mt-2 flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/10">
          <p className="text-sm text-[#8E8E93]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#CCFF00] font-bold uppercase tracking-wider hover:underline ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#8E8E93] uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
          Encrypted Authentication
        </div>
      </div>
    </main>
  );
}
