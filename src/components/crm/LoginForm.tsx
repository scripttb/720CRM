"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@crm.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou palavra-passe inválidos');
      } else {
        toast.success('Bem-vindo ao Sistema CRM!');
      }
    } catch (error) {
      setError('Ocorreu um erro durante o início de sessão');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Sistema CRM</span>
          </div>
          <CardTitle className="text-2xl text-center">Iniciar Sessão</CardTitle>
          <CardDescription className="text-center">
            Insira as suas credenciais para aceder ao painel CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correio Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Insira o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Insira a sua palavra-passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sessão
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Credenciais de Demonstração:</p>
            <p className="text-xs text-muted-foreground">Email: demo@crm.com</p>
            <p className="text-xs text-muted-foreground">Palavra-passe: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
