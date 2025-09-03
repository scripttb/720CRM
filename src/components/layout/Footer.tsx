import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex justify-center w-full border-t">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-between px-4 py-6 md:px-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sistema CRM. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:underline"
          >
            Sobre Nós
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Termos de Serviço
          </Link>
        </div>
      </div>
    </footer>
  );
}
