"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Code2, AlertTriangle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CellData {
  id: string;
  type: "markdown" | "code";
  source: string;
  outputs: string[];
}

export function NotebookPlayer({ content }: { content: string }) {
  const [cells, setCells] = useState<CellData[]>([]);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [executingCellId, setExecutingCellId] = useState<string | null>(null);
  const pyodideInstance = useRef<any>(null);

  useEffect(() => {
    try {
      const data = JSON.parse(content);
      if (data.cells && Array.isArray(data.cells)) {
        const parsed = data.cells.map((c: any, i: number) => ({
          id: `cell-${i}`,
          type: c.cell_type === "markdown" ? "markdown" : "code",
          source: Array.isArray(c.source) ? c.source.join("") : (c.source || ""),
          outputs: []
        }));
        setCells(parsed);
      }
    } catch (e) {
      console.error(e);
      setCells([{
        id: "error",
        type: "markdown",
        source: "⚠️ **Erro:** Inválido ou impossível ler este Notebook JSON.",
        outputs: []
      }]);
    }
  }, [content]);

  useEffect(() => {
    if (window.loadPyodide) {
      initPyodide();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    script.async = true;
    script.onload = initPyodide;
    document.body.appendChild(script);

    async function initPyodide() {
      try {
        const py = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        pyodideInstance.current = py;
        setPyodideReady(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const runCell = async (cellId: string, code: string) => {
    if (!pyodideInstance.current) return;
    setExecutingCellId(cellId);
    
    // Zera outputs passados desta célula específica
    setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [] } : c));

    // Captura prints para esta célula
    pyodideInstance.current.setStdout({
      batched: (str: string) => {
        setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [...c.outputs, str] } : c));
      }
    });
    
    pyodideInstance.current.setStderr({
      batched: (str: string) => {
        setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [...c.outputs, `[ERROR] ${str}`] } : c));
      }
    });

    try {
      await pyodideInstance.current.runPythonAsync(code);
    } catch (err: any) {
      setCells(prev => prev.map(c => c.id === cellId ? { ...c, outputs: [...c.outputs, `[ERROR] ${err.toString()}`] } : c));
    } finally {
      setExecutingCellId(null);
    }
  };

  const updateCellSource = (id: string, newSource: string) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, source: newSource } : c));
  };

  return (
    <div className="bg-[#f4f4f4] border border-[#e0e0e0] rounded-xl overflow-hidden shadow-sm font-sans flex flex-col">
      {/* Navbar do Notebook */}
      <div className="bg-[#161616] p-3 border-b flex justify-between items-center text-[#f4f4f4]">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-[#4589ff]" />
          <span className="font-semibold text-sm tracking-wide">Jupyter Runtime</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#a8a8a8]">
          {isLoading ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Carregando Motor de IA...</>
          ) : pyodideReady ? (
            <><div className="w-2 h-2 rounded-full bg-[#24a148]"></div> Python 3.11 WASM Pronto</>
          ) : (
            <><AlertTriangle className="w-3 h-3 text-[#da1e28]" /> Falha na Inicialização</>
          )}
        </div>
      </div>

      {/* Lista de Células */}
      <div className="p-4 md:p-6 space-y-8 max-h-[800px] overflow-y-auto">
        {cells.map((cell, index) => (
          <div key={cell.id} className="group flex flex-col gap-2">
            
            {cell.type === "markdown" ? (
              <div className="prose prose-sm max-w-none text-[#161616] leading-relaxed">
                <ReactMarkdown>{cell.source}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex gap-2">
                {/* Linha da Vingança à esquerda */}
                <div className="w-10 flex flex-col items-end text-xs font-mono text-[#8d8d8d] pt-2">
                  [{executingCellId === cell.id ? "*" : index}]
                </div>

                {/* Editor e Botões */}
                <div className="flex-1 bg-white border border-[#c6c6c6] shadow-sm rounded-md overflow-hidden relative">
                  
                  {/* Action Bar Horizontal (Run Button overlay style via flex) */}
                  <div className="bg-[#f4f4f4] border-b border-[#e0e0e0] flex py-1 px-2">
                     <Button 
                       size="sm" 
                       variant="ghost" 
                       className="h-6 px-2 text-[#0f62fe] hover:bg-[#0f62fe]/10 hover:text-[#0043ce]"
                       onClick={() => runCell(cell.id, cell.source)}
                       disabled={!pyodideReady || executingCellId !== null}
                     >
                       {executingCellId === cell.id ? (
                         <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                       ) : (
                         <Play className="w-3 h-3 mr-1.5 fill-current" />
                       )}
                       <span className="text-[10px] font-bold uppercase tracking-wider">Rodar</span>
                     </Button>
                  </div>

                  <Editor
                    height={`${Math.max(100, cell.source.split("\\n").length * 21)}px`}
                    defaultLanguage="python"
                    value={cell.source}
                    onChange={(val) => updateCellSource(cell.id, val || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'var(--font-mono, monospace)',
                      lineNumbers: "off",
                      scrollBeyondLastLine: false,
                      padding: { top: 12, bottom: 12 },
                    }}
                  />
                  
                  {/* Área de Output */}
                  {cell.outputs.length > 0 && (
                    <div className="border-t border-[#e0e0e0] bg-[#161616] p-3 text-[#f4f4f4] font-mono text-xs overflow-x-auto">
                      {cell.outputs.map((out, oidx) => (
                        <div key={oidx} className={out.includes("[ERROR]") ? "text-[#fa4d56]" : ""}>
                          {out}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
