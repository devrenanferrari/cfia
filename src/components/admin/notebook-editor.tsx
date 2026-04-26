"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Code2, FileText, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";

interface Cell {
  id: string;
  cell_type: "markdown" | "code";
  source: string;
}

interface NotebookData {
  cells: Cell[];
}

interface NotebookEditorProps {
  initialContent: string | null;
  onChange: (jsonContent: string) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function NotebookEditor({ initialContent, onChange }: NotebookEditorProps) {
  const [cells, setCells] = useState<Cell[]>([]);

  // Carregar conteúdo inicial
  useEffect(() => {
    if (initialContent) {
      try {
        const data = JSON.parse(initialContent);
        if (data && Array.isArray(data.cells)) {
          const loadedCells = data.cells.map((c: any) => ({
            id: generateId(),
            cell_type: c.cell_type === "markdown" ? "markdown" : "code",
            source: Array.isArray(c.source) ? c.source.join("") : (c.source || ""),
          }));
          setCells(loadedCells);
        }
      } catch (e) {
        console.error("Erro ao carregar notebook inicial", e);
      }
    } else {
      // Começa com uma célula de markdown padrão se vazio
      setCells([{ id: generateId(), cell_type: "markdown", source: "### Novo Exercício Prático\n\nDescreva as instruções aqui." }]);
    }
  }, [initialContent]);

  // Salva no objeto pai sempre que 'cells' mudar
  const saveChanges = (newCells: Cell[]) => {
    setCells(newCells);
    const payload: NotebookData = {
      cells: newCells.map((c) => ({
        id: c.id,
        cell_type: c.cell_type,
        source: c.source
      }))
    };
    onChange(JSON.stringify(payload, null, 2));
  };

  const addCell = (type: "markdown" | "code") => {
    saveChanges([...cells, { id: generateId(), cell_type: type, source: type === "code" ? "# Escreva seu código Python aqui\n" : "" }]);
  };

  const updateCellSource = (id: string, newSource: string) => {
    saveChanges(cells.map((c) => c.id === id ? { ...c, source: newSource } : c));
  };

  const removeCell = (id: string) => {
    saveChanges(cells.filter(c => c.id !== id));
  };

  const moveCell = (index: number, direction: "up" | "down") => {
    const newCells = [...cells];
    if (direction === "up" && index > 0) {
      [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
      saveChanges(newCells);
    } else if (direction === "down" && index < newCells.length - 1) {
      [newCells[index + 1], newCells[index]] = [newCells[index], newCells[index + 1]];
      saveChanges(newCells);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        JSON.parse(jsonStr); // Valida JSON
        onChange(jsonStr);
        // Atualiza a visualização localmente
        const data = JSON.parse(jsonStr);
        if (data.cells) {
            const loadedCells = data.cells.map((c: any) => ({
                id: generateId(),
                cell_type: c.cell_type === "markdown" ? "markdown" : "code",
                source: Array.isArray(c.source) ? c.source.join("") : (c.source || ""),
            }));
            setCells(loadedCells);
        }
        toast.success("Notebook (.ipynb) importado com sucesso!");
      } catch (err) {
        toast.error("O arquivo fornecido não é um JSON Jupyter válido.");
      }
    };
    reader.readAsText(file);
    // Limpar input
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Botões Superiores */}
      <div className="flex items-center gap-2 mb-4 bg-muted/50 p-2 rounded-lg border">
        <Button size="sm" variant="outline" onClick={() => addCell("markdown")}>
          <FileText className="w-4 h-4 mr-2 text-blue-600" />
          Adicionar Texto
        </Button>
        <Button size="sm" variant="outline" onClick={() => addCell("code")}>
          <Code2 className="w-4 h-4 mr-2 text-green-600" />
          Adicionar Código
        </Button>
        
        <div className="ml-auto relative">
          <input 
            type="file" 
            accept=".ipynb" 
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Importar .ipynb"
          />
          <Button size="sm" variant="secondary" className="pointer-events-none">
            <Upload className="w-4 h-4 mr-2" />
            Importar .ipynb
          </Button>
        </div>
      </div>

      {/* Lista de Células */}
      <div className="space-y-3">
        {cells.map((cell, index) => (
          <div key={cell.id} className="relative group border rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-muted/50 px-3 py-1.5 border-b">
              <div className="flex items-center gap-2">
                {cell.cell_type === "markdown" ? (
                  <><FileText className="w-4 h-4 text-blue-600" /> <span className="text-xs font-semibold uppercase text-muted-foreground">Texto (Markdown)</span></>
                ) : (
                  <><Code2 className="w-4 h-4 text-green-600" /> <span className="text-xs font-semibold uppercase text-muted-foreground">Código (Python)</span></>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveCell(index, "up")} disabled={index === 0}>
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => moveCell(index, "down")} disabled={index === cells.length - 1}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => removeCell(cell.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Editor de Célula */}
            <div className="p-0">
              {cell.cell_type === "markdown" ? (
                <Textarea 
                  value={cell.source} 
                  onChange={(e) => updateCellSource(cell.id, e.target.value)} 
                  className="w-full border-0 resize-y min-h-[100px] rounded-none focus-visible:ring-0 p-4 font-mono text-sm bg-muted/10 placeholder:text-muted-foreground/50"
                  placeholder="Escreva em markdown (ex: # Título, **Negrito**)"
                />
              ) : (
                <div className="h-[150px] resize-y overflow-hidden border-t-0 p-2 bg-[#1e1e1e]">
                   <Editor
                     height="100%"
                     defaultLanguage="python"
                     value={cell.source}
                     theme="vs-dark"
                     onChange={(val) => updateCellSource(cell.id, val || "")}
                     options={{
                       minimap: { enabled: false },
                       fontSize: 14,
                       fontFamily: 'var(--font-mono, monospace)',
                       lineNumbers: "on",
                       scrollBeyondLastLine: false,
                       padding: { top: 8, bottom: 8 },
                     }}
                   />
                </div>
              )}
            </div>

          </div>
        ))}
        {cells.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
             <Code2 className="w-8 h-8 opacity-20 mx-auto mb-2" />
             <p className="text-sm">Nenhuma célula neste exercício prático.</p>
             <p className="text-xs opacity-70">Adicione código ou texto acima, ou importe um notebook .ipynb</p>
          </div>
        )}
      </div>

    </div>
  );
}
