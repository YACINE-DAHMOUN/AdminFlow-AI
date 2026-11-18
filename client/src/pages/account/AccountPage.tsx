import { PageHeading } from "../../components/shared/PageHeading";
import { useAuth } from "../../store/auth.context";
import { useNavigate } from "@tanstack/react-router";
import { useState } from 'react';
import { Loader2 } from "lucide-react"

export default function AccountPage() {
  const { logoutAll } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoutAll = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await logoutAll();
      navigate({ to: "/login" });
    } catch {
      setError(
        "Impossible de fermer les sessions. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeading
        eyebrow="Paramètres"
        title="Mon compte"
        description="Gérez la sécurité de votre compte"
      />
      <section
        aria-labelledby="security-title"
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2
          id="security-title"
          className="text-lg text-foreground font-semibold"
        >
          Sécurité
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Vous vous êtes connecté sur un autre ordinateur ou téléphone ? Ce
          bouton ferme toutes vos sessions ouvertes, y compris celle-ci.
        </p>

                <button
          type="button"
          onClick={handleLogoutAll}
          disabled={isLoading}
          className="
            mt-4 inline-flex items-center justify-center gap-2
            min-h-11 px-4 py-2.5
            text-sm font-semibold text-primary-foreground
            bg-primary hover:opacity-90 rounded-full transition-opacity
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Déconnexion…</span>
            </>
          ) : (
            "Me déconnecter de tous les appareils"
          )}
        </button>

        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
