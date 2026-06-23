"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, User, Mail, Shield } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const router = useRouter();
  const { data: sessionData, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPending && !sessionData) {
      router.push("/sign-up");
    }
  }, [isPending, sessionData, router]);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (!sessionData) {
    return null; // Will redirect in useEffect
  }

  const user = sessionData.user;

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="relative w-full max-w-md">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <Card className="border border-border/80 bg-card/60 backdrop-blur-md shadow-2xl">
          <CardHeader className="space-y-1.5 pb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "User avatar"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <CardTitle className="font-heading text-3xl font-semibold tracking-tight text-foreground mt-4">
              User Profile
            </CardTitle>
            <CardDescription className="text-muted-foreground/90">
              Welcome back to your workspace
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3.5 rounded-lg border border-border/60 bg-background/40 p-4">
              <div className="flex items-center gap-3">
                <User className="h-4.5 w-4.5 text-muted-foreground/75" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-semibold text-foreground truncate">{user.name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-border/40 pt-3">
                <Mail className="h-4.5 w-4.5 text-muted-foreground/75" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-foreground truncate">{user.email || "N/A"}</p>
                </div>
              </div>

              {(user as any).role && (
                <div className="flex items-center gap-3 border-t border-border/40 pt-3">
                  <Shield className="h-4.5 w-4.5 text-muted-foreground/75" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</p>
                    <p className="text-sm font-semibold text-foreground truncate capitalize">{(user as any).role}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6">
            <Button
              variant="destructive"
              disabled={loggingOut}
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 shadow-lg hover:shadow-destructive/10 transition-all duration-200 cursor-pointer"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
