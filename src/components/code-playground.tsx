"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Bug, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    loadPyodide: (config: any) => Promise<any>;
  }
}

const DEFAULT_CODE = `# Bem-vindo ao Laboratório CFIA!
# Aqui você pode rodar Python direto no seu navegador.
# Nossa IA roda localmente, sem custos de servidor e com privacidade total.

def calcular_salario_dev_ia(anos_experiencia):
    salario_base = 8000
    if anos_experiencia > 2:
        return salario_base + (anos_experiencia * 2500)
    return salario_base

experiencia = 3
salario = calcular_salario_dev_ia(experiencia)

print(f"Um Dev IA com {experiencia} anos de experiência")
print(f"pode ter salário base de: R$ {salario:.2f}\\n")

print("Tente editar o código acima e rodar novamente!")
`;

export function CodePlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const pyodideInstance = useRef<any>(null);

  useEffect(() => {
    // Inject Pyodide script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    script.async = true;
    script.onload = async () => {
      try {
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        
        // Redirect stdout and stderr straight to our console panel
        pyodide.setStdout({ batched: (str: string) => setOutput((prev) => [...prev, str]) });
        pyodide.setStderr({ batched: (str: string) => setOutput((prev) => [...prev, `[ERRO] ${str}`]) });

        pyodideInstance.current = pyodide;
        setIsLoading(false);
        setOutput(["[Sistema] Ambiente Python local (WebAssembly) carregado com sucesso."]);
      } catch (err) {
        console.error("Pyodide fallback error", err);
        setOutput(["[Sistema] Falha ao carregar o ambiente. Verifique a conexão."]);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const runCode = async () => {
    if (!pyodideInstance.current) return;
    setIsRunning(true);
    // Clear previous output except the system message
    setOutput(["[Sistema] Executando script..."]);
    
    try {
      // Overwrite print so it flashes output natively
      await pyodideInstance.current.runPythonAsync(code);
      setOutput((prev) => [...prev, "", "[Sistema] Código executado com sucesso."]);
    } catch (error: any) {
      setOutput((prev) => [...prev, "", `[Erro de Validação]`]);
      setOutput((prev) => [...prev, error.message || error.toString()]);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setOutput(["[Sistema] Ambiente resetado."]);
  };

  return (
    <div className="flex flex-col h-[600px] border border-[#e0e0e0] bg-[#161616] text-[#e0e0e0] font-mono text-sm overflow-hidden">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-[#393939] bg-[#262626]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#393939]">
            {isLoading ? <Loader2 className="w-4 h-4 text-[#8d8d8d] animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-[#24a148]" />}
          </div>
          <div>
            <p className="font-bold text-xs uppercase tracking-widest text-[#f4f4f4] mb-0.5">Laboratório</p>
            <p className="text-[10px] text-[#8d8d8d]">sandbox.py — Python 3.11 (Pyodide WASM)</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetCode}
            disabled={isLoading || isRunning}
            className="rounded-none border-[#525252] bg-transparent text-[#e0e0e0] hover:bg-[#393939] hover:text-white h-8 text-xs font-mono"
          >
            <RefreshCw className="w-3 h-3 mr-2" /> Reset
          </Button>
          <Button 
            size="sm" 
            onClick={runCode}
            disabled={isLoading || isRunning}
            className="rounded-none bg-[#0f62fe] text-white hover:bg-[#0353e9] h-8 px-4 text-xs font-bold uppercase tracking-widest"
          >
            {isRunning ? (
              <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Rodando</>
            ) : (
              <><Play className="w-3 h-3 mr-2 fill-current" /> Executar</>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Left */}
        <div className="w-1/2 border-r border-[#393939] flex flex-col relative bg-[#1e1e1e]">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'var(--font-mono, monospace)',
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              roundedSelection: false,
              renderLineHighlight: "none",
            }}
          />
          {/* Subtle loading overlay for the editor */}
          {isLoading && (
            <div className="absolute inset-0 bg-[#161616]/80 flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="text-center">
                <Loader2 className="w-6 h-6 text-[#0f62fe] animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#8d8d8d] uppercase tracking-widest">Iniciando motor de Inteligência...</p>
              </div>
            </div>
          )}
        </div>

        {/* Console Right */}
        <div className="w-1/2 bg-[#161616] p-4 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 border-b border-[#393939] pb-2">
            <Terminal className="w-4 h-4 text-[#8d8d8d]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8d8d8d]">Console de Saída</h3>
          </div>
          
          <div className="flex-1 text-[#f4f4f4] space-y-1.5 break-words">
            {output.map((line, idx) => (
              <div 
                key={idx} 
                className={line.includes("[Erro") ? "text-[#da1e28]" : line.includes("[Sistema]") ? "text-[#4589ff] opacity-80 text-xs" : ""}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {line}
              </div>
            ))}
            {output.length === 0 && !isLoading && (
              <div className="text-[#525252] text-xs italic">A saída do seu programa aparecerá aqui...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Emulating the Terminal Icon just for this file nicely since we didn't import it at the top
function Terminal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}
