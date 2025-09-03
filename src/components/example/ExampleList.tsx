'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, ApiError } from '@/lib/api-client';
import { toast } from 'sonner';

interface Example {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

export default function ExampleList() {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(false);
  const [newExample, setNewExample] = useState({ name: '', description: '' });

  // Obter dados de exemplo
  const fetchExamples = async () => {
    setLoading(true);
    try {
      const data = await api.get<Example[]>('/example');
      setExamples(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Falha ao carregar exemplos: ${error.message}`);
      } else {
        toast.error('Ocorreu um erro inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  // Criar novo exemplo
  const createExample = async () => {
    if (!newExample.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      const data = await api.post<Example>('/example', newExample);
      setExamples(prev => [...prev, data]);
      setNewExample({ name: '', description: '' });
      toast.success('Exemplo criado com sucesso');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Falha ao criar exemplo: ${error.message}`);
      } else {
        toast.error('Ocorreu um erro inesperado');
      }
    }
  };

  // Eliminar exemplo
  const deleteExample = async (id: number) => {
    try {
      await api.delete(`/example?id=${id}`);
      setExamples(prev => prev.filter(item => item.id !== id));
      toast.success('Exemplo eliminado com sucesso');
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Falha ao eliminar exemplo: ${error.message}`);
      } else {
        toast.error('Ocorreu um erro inesperado');
      }
    }
  };

  useEffect(() => {
    fetchExamples();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Exemplos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Criar novo exemplo */}
          <div className="flex gap-2 flex-wrap">
            <Input
              placeholder="Nome"
              value={newExample.name}
              onChange={(e) => setNewExample(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 min-w-0"
            />
            <Input
              placeholder="Descrição (opcional)"
              value={newExample.description}
              onChange={(e) => setNewExample(prev => ({ ...prev, description: e.target.value }))}
              className="flex-1 min-w-0"
            />
            <Button onClick={createExample} className="whitespace-nowrap">
              Adicionar Exemplo
            </Button>
          </div>

          {/* Botão de actualizar */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={fetchExamples} disabled={loading}>
              {loading ? 'A carregar...' : 'Actualizar'}
            </Button>
          </div>

          {/* Lista de exemplos */}
          <div className="space-y-2">
            {examples.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {loading ? 'A carregar exemplos...' : 'Nenhum exemplo encontrado. Crie um acima.'}
              </p>
            ) : (
              examples.map((example) => (
                <Card key={example.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{example.name}</h3>
                      {example.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {example.description}
                        </p>
                      )}
                      {example.created_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Criado: {new Date(example.created_at).toLocaleDateString('pt-AO')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteExample(example.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
