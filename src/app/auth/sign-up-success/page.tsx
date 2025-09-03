import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Conta Criada!</CardTitle>
            <CardDescription>Verifique seu email para confirmar sua conta</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-sm text-muted-foreground">
              Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta e fazer login.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Voltar para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
