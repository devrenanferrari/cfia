"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Trash2, 
  Code2, 
  FileText, 
  Upload, 
  ChevronUp, 
  ChevronDown, 
  Play, 
  Loader2,
  Terminal,
  Save,
  Layout
} from "lucide-react";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Cell {
  id: string;
  cell_type: "markdown" | "code";
  source: string;
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
  const [pyodideReady, setPyodideReady] = useState(false);
  const [executingCellId, setExecutingCellId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const pyodideInstance = useRef<any>(null);

  // Inicializa Pyodide apenas para teste opcional pelo instrutor
  useEffect(() => {
    const loadPyodide = async () => {
        if (typeof (window as any).loadPyodide === "function") {
            initPyodide();
        } else {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
            script.async = true;
            script.onload = initPyodide;
            document.body.appendChild(script);
        }
    };

    async function initPyodide() {
      try {
        const py = await (window as any).loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        pyodideInstance.current = py;
        setPyodideReady(true);
      } catch (e) {
        console.error("Pyodide Editor Load Error", e);
      }
    }
    loadPyodide();
  }, []);

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
      setCells([{ id: generateId(), cell_type: "markdown", source: "### Instruções do Exercício\nDescreva o que o aluno deve fazer." }]);
    }
  }, [initialContent]);

  const saveChanges = (newCells: Cell[]) => {
    setCells(newCells);
    const payload = {
      cells: newCells.map((c) => ({
        id: c.id,
        cell_type: c.cell_type,
        source: c.source
      }))
    };
    onChange(JSON.stringify(payload, null, 2));
  };

  const addCell = (type: "markdown" | "code") => {
    saveChanges([...cells, { id: generateId(), cell_type: type, source: type === "code" ? "# Escreva o código base aqui\n" : "" }]);
    toast.success(`${type === "code" ? "Código" : "Texto"} adicionado`);
  };

  const updateCellSource = (id: string, newSource: string) => {
    setCells(prev => prev.map((c) => c.id === id ? { ...c, source: newSource } : c));
    // Notifica o formulário pai com debounce ou após edição manual
    const updated = cells.map((c) => c.id === id ? { ...c, source: newSource } : c);
    const payload = { cells: updated };
    onChange(JSON.stringify(payload));
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

  const testCell = async (id: string, code: string) => {
    if (!pyodideInstance.current) return;
    setExecutingCellId(id);
    try {
      await pyodideInstance.current.runPythonAsync(code);
      toast.success("Código executado sem erros!");
    } catch (err: any) {
      toast.error(`Erro no código: ${err.message}`);
    } finally {
      setExecutingCellId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.cells) {
            const loadedCells = data.cells.map((c: any) => ({
                id: generateId(),
                cell_type: c.cell_type === "markdown" ? "markdown" : "code",
                source: Array.isArray(c.source) ? c.source.join("") : (c.source || ""),
            }));
            saveChanges(loadedCells);
            toast.success("Notebook importado!");
        }
      } catch (err) {
        toast.error("Erro ao ler .ipynb");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="border rounded-xl bg-[#f4f4f4] overflow-hidden flex flex-col min-h-[500px]">
      
      {/* Toolbar Superior */}
      <div className="bg-[#161616] border-b border-[#393939] px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#4589ff]" />
            <span className="text-[#f4f4f4] text-xs font-bold uppercase tracking-wider">Construtor de Exercícios</span>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="bg-[#262626] rounded-md p-0.5 flex">
                <button 
                  onClick={() => setActiveTab("edit")}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase rounded-sm transition-all",
                    activeTab === "edit" ? "bg-[#393939] text-white" : "text-[#a8a8a8] hover:text-white"
                  )}
                >Editar</button>
                <button 
                  onClick={() => setActiveTab("preview")}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase rounded-sm transition-all",
                    activeTab === "preview" ? "bg-[#393939] text-white" : "text-[#a8a8a8] hover:text-white"
                  )}
                >Visualizar</button>
            </div>
            
            <div className="w-px h-6 bg-[#393939] mx-2" />
            
            <Button size="sm" variant="ghost" className="h-8 text-[#f4f4f4] hover:bg-[#393939] px-2 text-xs gap-2" onClick={() => addCell("markdown")}>
                <FileText className="w-3 h-3" /> Texto
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-[#f4f4f4] hover:bg-[#393939] px-2 text-xs gap-2" onClick={() => addCell("code")}>
                <Code2 className="w-3 h-3" /> Código
            </Button>
            
            <div className="relative">
                <input type="file" accept=".ipynb" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Button size="sm" variant="ghost" className="h-8 text-[#f4f4f4] hover:bg-[#393939] px-2 text-xs gap-2">
                    <Upload className="w-3 h-3" /> Importar
                </Button>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {activeTab === "edit" ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {cells.map((cell, index) => (
              <div key={cell.id} className="group relative bg-white border border-[#e0e0e0] rounded-lg shadow-sm hover:border-[#0f62fe] transition-all overflow-hidden flex">
                
                {/* Drag / Indexer Handle */}
                <div className="w-8 bg-[#f4f4f4] border-r flex flex-col items-center py-4 gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-[#e0e0e0] rounded" onClick={() => moveCell(index, "up")} disabled={index === 0}>
                        <ChevronUp className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-mono font-bold">{index}</span>
                    <button className="p-1 hover:bg-[#e0e0e0] rounded" onClick={() => moveCell(index, "down")} disabled={index === cells.length - 1}>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col">
                    {/* Inner Toolbar */}
                    <div className="bg-white px-4 py-2 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {cell.cell_type === "markdown" ? <FileText className="w-4 h-4 text-blue-600" /> : <Code2 className="w-4 h-4 text-green-600" />}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#525252]">
                                {cell.cell_type === "markdown" ? "Markdown" : "Python Code"}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                             {cell.cell_type === "code" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 text-[#24a148] hover:bg-[#24a148]/10 text-[10px] font-bold uppercase gap-1.5"
                                  onClick={() => testCell(cell.id, cell.source)}
                                  disabled={executingCellId !== null}
                                >
                                    {executingCellId === cell.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Play className="w-3 h-3 fill-current" />}
                                    Testar
                                </Button>
                             )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-[#da1e28] hover:bg-[#da1e28]/10"
                              onClick={() => removeCell(cell.id)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Editor Space */}
                    {cell.cell_type === "markdown" ? (
                        <textarea 
                          className="w-full p-4 font-mono text-sm min-h-[100px] outline-none border-b focus:bg-[#f4faff] transition-colors resize-y"
                          placeholder="# Título do Bloco"
                          value={cell.source}
                          onChange={(e) => updateCellSource(cell.id, e.target.value)}
                        />
                    ) : (
                        <div className="h-[200px] border-b">
                            <Editor
                                height="100%"
                                defaultLanguage="python"
                                value={cell.source}
                                onChange={(val) => updateCellSource(cell.id, val || "")}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    lineNumbers: "on",
                                    padding: { top: 12, bottom: 12 },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border shadow-sm min-h-[400px]">
             <div className="space-y-6">
                {cells.map((cell) => (
                    <div key={cell.id}>
                        {cell.cell_type === "markdown" ? (
                            <div className="prose prose-slate max-w-none">
                                <ReactMarkdown>{cell.source}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="bg-[#f4f4f4] border p-4 rounded-md font-mono text-sm whitespace-pre-wrap border-l-4 border-l-green-600">
                                {cell.source}
                            </div>
                        )}
                    </div>
                ))}
             </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t px-4 py-3 flex items-center justify-between text-[11px] text-[#525252]">
          <div className="flex items-center gap-4">
              <span>Total de Células: <strong>{cells.length}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full", pyodideReady ? "bg-[#24a148]" : "bg-[#f1c21b]")} />
                  Execução: {pyodideReady ? "Disponível para Teste" : "Carregando Python..."}
              </span>
          </div>
          <p className="italic opacity-50">Dica: Arraste a borda inferior das células de texto para redimensionar.</p>
      </div>

    </div>
  );
}

