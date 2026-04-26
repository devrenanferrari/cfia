"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import { 
  Play, 
  Loader2, 
  Code2, 
  AlertTriangle, 
  Terminal, 
  RotateCcw, 
  PlayCircle,
  Package,
  CheckCircle2,
  XCircle,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CellData {
  id: string;
  type: "markdown" | "code";
  source: string;
  outputs: { text: string; type: "stdout" | "stderr" | "result" }[];
  executionCount: number | null;
}

export function NotebookPlayer({ content }: { content: string }) {
  const [cells, setCells] = useState<CellData[]>([]);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [kernelStatus, setKernelStatus] = useState<"idle" | "busy" | "loading" | "error">("loading");
  const [executingCellId, setExecutingCellId] = useState<string | null>(null);
  const [initialLoadingProgress, setInitialLoadingProgress] = useState(0);
  
  const pyodideInstance = useRef<any>(null);
  const executionCounter = useRef(0);

  // Parsing do conteúdo do Notebook
  useEffect(() => {
    try {
      const data = JSON.parse(content);
      if (data.cells && Array.isArray(data.cells)) {
        const parsed = data.cells.map((c: any, i: number) => ({
          id: `cell-${i}`,
          type: c.cell_type === "markdown" ? "markdown" : "code",
          source: Array.isArray(c.source) ? c.source.join("") : (c.source || ""),
          outputs: [],
          executionCount: null
        }));
        setCells(parsed);
      }
    } catch (e) {
      console.error(e);
      setCells([{
        id: "error",
        type: "markdown",
        source: "### ⚠️ Erro de Carregamento\nNão foi possível processar o formato deste Notebook.",
        outputs: [],
        executionCount: null
      }]);
    }
  }, [content]);

  // Inicialização do Pyodide
  useEffect(() => {
    const loadPyodideScript = () => {
      if ((window as any).loadPyodide) {
        initPyodide();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      script.async = true;
      script.onload = initPyodide;
      document.body.appendChild(script);
    };

    async function initPyodide() {
      try {
        setKernelStatus("loading");
        setInitialLoadingProgress(20);
        
        const py = await (window as any).loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        
        setInitialLoadingProgress(60);
        
        // Carrega micropip para permitir instalação de pacotes
        await py.loadPackage("micropip");
        const micropip = py.pyimport("micropip");
        
        setInitialLoadingProgress(100);
        pyodideInstance.current = py;
        setPyodideReady(true);
        setKernelStatus("idle");
      } catch (e) {
        console.error("Pyodide Load Error:", e);
        setKernelStatus("error");
        toast.error("Falha ao inicializar motor Python.");
      }
    }

    loadPyodideScript();
  }, []);

  const runCell = async (cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell || !pyodideInstance.current || kernelStatus === "busy") return;

    setKernelStatus("busy");
    setExecutingCellId(cellId);
    
    // Limpar outputs da célula
    setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [], executionCount: null } : c));

    const py = pyodideInstance.current;
    const currentOutputs: { text: string; type: "stdout" | "stderr" | "result" }[] = [];

    // Redirecionar stdout/stderr
    py.setStdout({
      batched: (str: string) => {
        currentOutputs.push({ text: str, type: "stdout" });
        setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [...currentOutputs] } : c));
      }
    });
    
    py.setStderr({
      batched: (str: string) => {
        currentOutputs.push({ text: str, type: "stderr" });
        setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [...currentOutputs] } : c));
      }
    });

    try {
      executionCounter.current += 1;
      const count = executionCounter.current;
      
      // Suporte para instalação automática de pacotes via código (micropip)
      // Se o código tiver 'pip install' ou 'import', tentamos rodar async
      const result = await py.runPythonAsync(cell.source);
      
      if (result !== undefined) {
        currentOutputs.push({ text: String(result), type: "result" });
      }

      setCells(prev => prev.map(c => c.id === cellId ? { 
        ...c, 
        outputs: [...currentOutputs],
        executionCount: count
      } : c));
      
    } catch (err: any) {
      currentOutputs.push({ text: err.toString(), type: "stderr" });
      setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [...currentOutputs] } : c));
    } finally {
      setExecutingCellId(null);
      setKernelStatus("idle");
    }
  };

  const runAllCells = async () => {
    for (const cell of cells) {
      if (cell.type === "code") {
        await runCell(cell.id);
      }
    }
  };

  const restartKernel = () => {
    window.location.reload(); // Forma mais segura de limpar o estado do Pyodide WASM
  };

  return (
    <div className="flex flex-col border rounded-xl bg-background shadow-2xl overflow-hidden min-h-[600px] transition-all">
      {/* Barra de Status Estilo Carbon */}
      <header className="bg-[#161616] h-12 flex items-center justify-between px-4 border-b border-[#393939] select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#4589ff]" />
            <span className="text-[#f4f4f4] text-xs font-bold uppercase tracking-wider">CPython 3.11 WASM</span>
          </div>
          <div className="h-4 w-[1px] bg-[#393939]" />
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              kernelStatus === "idle" && "bg-[#24a148] shadow-[0_0_8px_#24a148]",
              kernelStatus === "busy" && "bg-[#f1c21b] animate-pulse",
              kernelStatus === "loading" && "bg-[#4589ff] animate-bounce",
              kernelStatus === "error" && "bg-[#da1e28]"
            )} />
            <span className="text-[#a8a8a8] text-[10px] font-medium uppercase">
              {kernelStatus === "idle" && "Pronto"}
              {kernelStatus === "busy" && "Processando..."}
              {kernelStatus === "loading" && "Iniciando Kernal"}
              {kernelStatus === "error" && "Erro no Motor"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-[#f4f4f4] hover:bg-[#393939] text-xs gap-2"
            onClick={runAllCells}
            disabled={kernelStatus !== "idle"}
          >
            <PlayCircle className="w-4 h-4 text-[#24a148]" />
            Rodar Tudo
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-[#f4f4f4] hover:bg-[#393939] text-xs gap-2"
            onClick={restartKernel}
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </Button>
        </div>
      </header>

      {/* Loading Overlay */}
      {kernelStatus === "loading" && (
        <div className="p-12 flex flex-col items-center justify-center bg-muted/20 flex-1 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#0f62fe]" />
            <div className="w-full max-w-xs space-y-2">
                <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest">Preparando Laboratório IA</p>
                <Progress value={initialLoadingProgress} className="h-1" />
            </div>
        </div>
      )}

      {/* Conteúdo do Notebook */}
      {kernelStatus !== "loading" && (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#f4f4f4]">
          {cells.map((cell, idx) => (
            <div key={cell.id} className="max-w-5xl mx-auto flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Indicador Lateral */}
              <div className="w-12 flex flex-col items-center pt-2 gap-2">
                <div className="text-[11px] font-mono text-muted-foreground/60 select-none">
                  [{cell.executionCount || (executingCellId === cell.id ? "*" : " ")}]
                </div>
                {cell.type === "code" && (
                   <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "h-8 w-8 rounded-full transition-all",
                        executingCellId === cell.id ? "bg-[#0f62fe] text-white" : "hover:bg-white hover:shadow-md text-[#0f62fe]"
                    )}
                    onClick={() => runCell(cell.id)}
                    disabled={kernelStatus === "busy" || !pyodideReady}
                   >
                    {executingCellId === cell.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                   </Button>
                )}
              </div>

              {/* Corpo da Célula */}
              <div className="flex-1 space-y-2">
                {cell.type === "markdown" ? (
                  <div className="prose prose-slate max-w-none px-2 py-1 text-[#161616]">
                    <ReactMarkdown>{cell.source}</ReactMarkdown>
                  </div>
                ) : (
                  <div className={cn(
                    "group relative border-l-4 rounded-r-md transition-all",
                    executingCellId === cell.id ? "border-[#0f62fe] shadow-lg" : "border-transparent hover:border-[#c6c6c6]"
                  )}>
                    {/* Editor Monaco */}
                    <div className="bg-white border shadow-sm rounded-r-md overflow-hidden">
                        <Editor
                            height={`${Math.max(40, cell.source.split("\n").length * 20 + 24)}px`}
                            defaultLanguage="python"
                            value={cell.source}
                            onChange={(val) => {
                                setCells(prev => prev.map(c => c.id === cell.id ? { ...c, source: val || "" } : c));
                            }}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'IBM Plex Mono', monospace",
                                lineNumbers: "off",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 12, bottom: 12 },
                                renderLineHighlight: "none",
                                folding: false,
                                scrollbar: {
                                    vertical: "hidden",
                                    horizontal: "hidden"
                                }
                            }}
                        />
                        
                        {/* Rodapé da Célula (Metadata) */}
                        <div className="bg-[#f4f4f4] border-t px-4 py-1.5 flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                            <div className="flex items-center gap-3">
                                <span className="uppercase tracking-widest">Python 3</span>
                                {cell.source.includes("micropip.install") && (
                                    <Badge variant="outline" className="h-4 px-1 gap-1 text-[8px] bg-blue-50 text-blue-700 border-blue-200">
                                        <Package className="w-2 h-2" />
                                        Gerenciador de Pacotes
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Área de Saída (Output) */}
                    {cell.outputs.length > 0 && (
                      <div className="mt-2 bg-[#161616] rounded-md border border-[#393939] overflow-hidden">
                        <div className="bg-[#262626] px-3 py-1 border-b border-[#393939] flex items-center gap-2">
                            <Terminal className="w-3 h-3 text-[#a8a8a8]" />
                            <span className="text-[10px] font-bold text-[#f4f4f4] uppercase tracking-tighter">Console Output</span>
                        </div>
                        <div className="p-3 font-mono text-xs space-y-1">
                          {cell.outputs.map((out, oidx) => (
                            <pre key={oidx} className={cn(
                              "whitespace-pre-wrap break-all leading-relaxed",
                              out.type === "stdout" && "text-[#f4f4f4]",
                              out.type === "stderr" && "text-[#fa4d56]",
                              out.type === "result" && "text-[#4589ff] font-bold italic border-t border-[#393939] mt-1 pt-1"
                            )}>
                              {out.type === "result" && "Out: "}{out.text}
                            </pre>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Dica de Uso */}
          <div className="max-w-5xl mx-auto px-16 pt-8 pb-12">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800">
                <Terminal className="w-5 h-5 flex-shrink-0" />
                <div className="text-xs space-y-1">
                    <p className="font-bold">Dica do Laboratório:</p>
                    <p>Você pode instalar bibliotecas do Python usando o <code>micropip</code>. Exemplo:</p>
                    <pre className="bg-white/50 p-2 rounded mt-1 font-mono">
                      import micropip{"\n"}
                      await micropip.install("pandas"){"\n"}
                      import pandas as pd
                    </pre>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
