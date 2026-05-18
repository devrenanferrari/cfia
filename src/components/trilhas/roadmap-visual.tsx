"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lock,
  BookOpen,
  Wrench,
  Star,
  Code2,
  Database,
  Terminal,
  BrainCircuit,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────────────────────── */

type NodeType = "concept" | "tool" | "project";
type NodeStatus = "available" | "coming-soon";

interface RoadmapNode {
  id: number;
  label: string;
  description: string;
  type: NodeType;
  status: NodeStatus;
  tags?: string[];
}

interface Phase {
  number: string;
  title: string;
  nodes: RoadmapNode[];
}

interface Track {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  phases: Phase[];
}

/* ── Data ─────────────────────────────────────────────────────────────── */

const TRACKS: Track[] = [
  {
    id: "engenheiro-ia",
    number: "01",
    title: "Engenheiro de IA",
    subtitle: "Construa e coloque modelos em produção",
    icon: Code2,
    phases: [
      {
        number: "01",
        title: "Fundamentos",
        nodes: [
          {
            id: 1,
            label: "Lógica de Programação",
            description:
              "Variáveis, condicionais, loops, funções. O ponto de partida de tudo. Sem isso, nada mais faz sentido.",
            type: "concept",
            status: "coming-soon",
            tags: ["Python", "Lógica"],
          },
          {
            id: 2,
            label: "Python do Zero ao Avançado",
            description:
              "A linguagem principal do campo de IA. Listas, dicionários, classes, módulos, async. Você vai usar Python em tudo.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "OOP"],
          },
          {
            id: 3,
            label: "Álgebra Linear & Cálculo",
            description:
              "Matrizes, vetores, derivadas, gradientes. Não precisa ser matemático — mas precisa entender o que o modelo está fazendo.",
            type: "concept",
            status: "coming-soon",
            tags: ["Matemática", "NumPy"],
          },
          {
            id: 4,
            label: "Git & Terminal",
            description:
              "Controle de versão e linha de comando. Sem isso, você não consegue trabalhar em equipe nem em produção.",
            type: "tool",
            status: "coming-soon",
            tags: ["Git", "Bash", "Linux"],
          },
        ],
      },
      {
        number: "02",
        title: "Machine Learning",
        nodes: [
          {
            id: 5,
            label: "Fundamentos de Machine Learning",
            description:
              "O que são treino, validação e teste. Overfitting, underfitting, regularização. Como o modelo aprende com dados.",
            type: "concept",
            status: "coming-soon",
            tags: ["Scikit-learn", "ML"],
          },
          {
            id: 6,
            label: "Redes Neurais com PyTorch",
            description:
              "O framework mais usado no campo de pesquisa. Tensores, autograd, construção de redes, treinamento manual.",
            type: "tool",
            status: "coming-soon",
            tags: ["PyTorch", "Deep Learning"],
          },
          {
            id: 7,
            label: "Visão Computacional",
            description:
              "CNNs, detecção de objetos, segmentação de imagens. Como fazer modelos que entendem o que estão vendo.",
            type: "concept",
            status: "coming-soon",
            tags: ["CV", "YOLO", "OpenCV"],
          },
          {
            id: 8,
            label: "Avaliação e Validação de Modelos",
            description:
              "Métricas: acurácia, F1, AUC-ROC. Cross-validation, confusion matrix. Como saber se seu modelo realmente funciona.",
            type: "concept",
            status: "coming-soon",
            tags: ["Métricas", "Sklearn"],
          },
        ],
      },
      {
        number: "03",
        title: "Produção",
        nodes: [
          {
            id: 9,
            label: "APIs com FastAPI",
            description:
              "Como expor seu modelo como uma API REST. Endpoints, validação de dados com Pydantic, documentação automática.",
            type: "tool",
            status: "coming-soon",
            tags: ["FastAPI", "REST", "Pydantic"],
          },
          {
            id: 10,
            label: "Docker & Containerização",
            description:
              "Empacote seu modelo junto com suas dependências para rodar em qualquer ambiente, sem surpresas.",
            type: "tool",
            status: "coming-soon",
            tags: ["Docker", "Containers"],
          },
          {
            id: 11,
            label: "Deploy em Cloud",
            description:
              "Colocar o container em produção na AWS ou GCP. EC2, ECS, Cloud Run — o modelo vai para o mundo.",
            type: "tool",
            status: "coming-soon",
            tags: ["AWS", "GCP", "Deploy"],
          },
          {
            id: 12,
            label: "Monitoramento & Logging",
            description:
              "Como saber se seu modelo está funcionando em produção. Logs estruturados, alertas, métricas de latência.",
            type: "concept",
            status: "coming-soon",
            tags: ["Observability", "Prometheus"],
          },
        ],
      },
      {
        number: "04",
        title: "Projeto Final",
        nodes: [
          {
            id: 13,
            label: "API de IA do Zero ao Deploy",
            description:
              "Você vai construir uma API de visão computacional completa: treinar o modelo, empacotar em Docker, fazer deploy na cloud e monitorar em produção. Portfólio real.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Projeto Real"],
          },
        ],
      },
    ],
  },
  {
    id: "cientista-dados",
    number: "02",
    title: "Cientista de Dados",
    subtitle: "Transforme dados brutos em decisões",
    icon: Database,
    phases: [
      {
        number: "01",
        title: "Fundamentos",
        nodes: [
          {
            id: 1,
            label: "Python para Análise de Dados",
            description:
              "Pandas, NumPy, Matplotlib. A base de qualquer análise. Como carregar, limpar e explorar dados com código.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "Pandas", "NumPy"],
          },
          {
            id: 2,
            label: "SQL do Básico ao Avançado",
            description:
              "SELECT, JOIN, GROUP BY, window functions, CTEs. Dados vivem em bancos — você precisa saber buscá-los.",
            type: "tool",
            status: "coming-soon",
            tags: ["SQL", "PostgreSQL"],
          },
          {
            id: 3,
            label: "Estatística Descritiva",
            description:
              "Média, mediana, desvio padrão, distribuições, correlação. Como resumir e entender dados antes de modelar.",
            type: "concept",
            status: "coming-soon",
            tags: ["Estatística", "Probabilidade"],
          },
          {
            id: 4,
            label: "Visualização de Dados",
            description:
              "Gráficos que contam histórias. Como comunicar insights para pessoas que não são técnicas.",
            type: "tool",
            status: "coming-soon",
            tags: ["Seaborn", "Matplotlib", "Plotly"],
          },
        ],
      },
      {
        number: "02",
        title: "Análise Avançada",
        nodes: [
          {
            id: 5,
            label: "Análise Exploratória (EDA)",
            description:
              "O processo de entender um dataset do zero. Distribuições, outliers, correlações, hipóteses iniciais.",
            type: "concept",
            status: "coming-soon",
            tags: ["EDA", "Pandas"],
          },
          {
            id: 6,
            label: "Estatística Inferencial & Testes",
            description:
              "Intervalos de confiança, testes de hipótese, p-valor. Como tirar conclusões confiáveis de amostras.",
            type: "concept",
            status: "coming-soon",
            tags: ["Inferência", "SciPy"],
          },
          {
            id: 7,
            label: "Feature Engineering",
            description:
              "Transformar variáveis brutas em features que modelos entendem. Encoding, scaling, criação de novas features.",
            type: "concept",
            status: "coming-soon",
            tags: ["Features", "Sklearn"],
          },
          {
            id: 8,
            label: "Experimentos A/B",
            description:
              "Como testar se uma mudança realmente fez diferença. Design de experimentos, significância estatística.",
            type: "concept",
            status: "coming-soon",
            tags: ["A/B Testing", "Estatística"],
          },
        ],
      },
      {
        number: "03",
        title: "Machine Learning",
        nodes: [
          {
            id: 9,
            label: "Regressão e Classificação",
            description:
              "Linear regression, logistic regression, KNN, SVM. Os modelos clássicos que ainda resolvem a maioria dos problemas.",
            type: "tool",
            status: "coming-soon",
            tags: ["Scikit-learn", "ML Clássico"],
          },
          {
            id: 10,
            label: "Ensemble: XGBoost & Random Forest",
            description:
              "Os modelos que dominam competições de dados. Gradient boosting, bagging, como tunar hiperparâmetros.",
            type: "tool",
            status: "coming-soon",
            tags: ["XGBoost", "Ensemble"],
          },
          {
            id: 11,
            label: "Séries Temporais",
            description:
              "ARIMA, Prophet, LSTM para dados temporais. Previsão de vendas, estoque, preços — problemas do mundo real.",
            type: "concept",
            status: "coming-soon",
            tags: ["Time Series", "Prophet"],
          },
          {
            id: 12,
            label: "Storytelling com Dados",
            description:
              "Como apresentar resultados para executivos e stakeholders. O insight técnico só vale se você conseguir comunicá-lo.",
            type: "concept",
            status: "coming-soon",
            tags: ["Comunicação", "BI"],
          },
        ],
      },
      {
        number: "04",
        title: "Projeto Final",
        nodes: [
          {
            id: 13,
            label: "Pipeline de Detecção de Fraude",
            description:
              "Um projeto end-to-end: ingestão de dados via SQL, análise exploratória, feature engineering, modelo de detecção, avaliação e relatório executivo. Portfólio real.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Projeto Real"],
          },
        ],
      },
    ],
  },
  {
    id: "ml-engineer",
    number: "03",
    title: "Engenheiro de ML",
    subtitle: "Infraestrutura e produção em escala",
    icon: Terminal,
    phases: [
      {
        number: "01",
        title: "Fundamentos",
        nodes: [
          {
            id: 1,
            label: "Python & Bash para Engenharia",
            description:
              "Python focado em scripts, automação e pipelines. Bash para operar servidores, mover arquivos, monitorar processos.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "Bash", "Linux"],
          },
          {
            id: 2,
            label: "Docker & Linux",
            description:
              "Containers são a base de tudo em MLOps. Dockerfile, docker-compose, volumes, networking entre containers.",
            type: "tool",
            status: "coming-soon",
            tags: ["Docker", "Linux"],
          },
          {
            id: 3,
            label: "ML Básico (Pré-requisito)",
            description:
              "Para fazer MLOps, você precisa entender o que está operando. Treino, validação, features, modelos clássicos.",
            type: "concept",
            status: "coming-soon",
            tags: ["Scikit-learn", "ML"],
          },
          {
            id: 4,
            label: "Git & CI/CD",
            description:
              "GitOps, GitHub Actions, pipelines de build automático. Como integração contínua funciona para sistemas de ML.",
            type: "tool",
            status: "coming-soon",
            tags: ["Git", "GitHub Actions", "CI/CD"],
          },
        ],
      },
      {
        number: "02",
        title: "Infraestrutura",
        nodes: [
          {
            id: 5,
            label: "Kubernetes para ML",
            description:
              "Orquestração de containers em escala. Pods, deployments, services. Como rodar modelos em cluster.",
            type: "tool",
            status: "coming-soon",
            tags: ["Kubernetes", "K8s"],
          },
          {
            id: 6,
            label: "Airflow: Pipelines de Dados",
            description:
              "Orquestração de workflows. DAGs, tasks, dependências. Como agendar e monitorar pipelines de ML.",
            type: "tool",
            status: "coming-soon",
            tags: ["Airflow", "Pipelines"],
          },
          {
            id: 7,
            label: "Feature Stores",
            description:
              "Armazenamento centralizado de features para treino e inferência. Feast, Tecton, como evitar training-serving skew.",
            type: "concept",
            status: "coming-soon",
            tags: ["Feature Store", "Feast"],
          },
          {
            id: 8,
            label: "MLflow: Rastreamento de Experimentos",
            description:
              "Como registrar parâmetros, métricas e artefatos de modelos. Model registry, comparação de experimentos.",
            type: "tool",
            status: "coming-soon",
            tags: ["MLflow", "Experimentos"],
          },
        ],
      },
      {
        number: "03",
        title: "Cloud & Escala",
        nodes: [
          {
            id: 9,
            label: "AWS para ML Engineers",
            description:
              "EC2, S3, ECS, ECR, IAM. A nuvem mais usada no mercado. Como configurar infra para ML do zero.",
            type: "tool",
            status: "coming-soon",
            tags: ["AWS", "Cloud"],
          },
          {
            id: 10,
            label: "SageMaker Pipelines",
            description:
              "A plataforma de ML gerenciada da AWS. Training jobs, endpoints, pipelines de treino automatizados.",
            type: "tool",
            status: "coming-soon",
            tags: ["SageMaker", "AWS"],
          },
          {
            id: 11,
            label: "Monitoramento de Data Drift",
            description:
              "Como detectar quando os dados de produção divergem do treino. Evidently AI, alertas automáticos, retreinamento.",
            type: "concept",
            status: "coming-soon",
            tags: ["Data Drift", "Evidently"],
          },
          {
            id: 12,
            label: "Otimização de Custos em Cloud",
            description:
              "Spot instances, auto-scaling, right-sizing. Como rodar ML em produção sem explodir o orçamento.",
            type: "concept",
            status: "coming-soon",
            tags: ["FinOps", "AWS"],
          },
        ],
      },
      {
        number: "04",
        title: "Projeto Final",
        nodes: [
          {
            id: 13,
            label: "Pipeline MLOps Completo com CI/CD",
            description:
              "Um sistema completo: modelo treinado via Airflow, rastreado no MLflow, servido via SageMaker, monitorado com Evidently e retreinado automaticamente via GitHub Actions.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Projeto Real"],
          },
        ],
      },
    ],
  },
  {
    id: "ia-generativa",
    number: "04",
    title: "IA Generativa",
    subtitle: "LLMs, RAG e agentes autônomos",
    icon: BrainCircuit,
    phases: [
      {
        number: "01",
        title: "Fundamentos",
        nodes: [
          {
            id: 1,
            label: "Python para LLMs",
            description:
              "Python focado em chamadas de API, manipulação de texto, async, tratamento de JSON. O que você usa todo dia com LLMs.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "APIs"],
          },
          {
            id: 2,
            label: "Como LLMs Funcionam",
            description:
              "Transformers, atenção, tokens, context window. Não é caixa-preta — entender o mecanismo muda como você usa o modelo.",
            type: "concept",
            status: "coming-soon",
            tags: ["Transformers", "Atenção"],
          },
          {
            id: 3,
            label: "APIs de IA: OpenAI & Anthropic",
            description:
              "Como chamar modelos via API. Parâmetros (temperature, top_p, max_tokens), contagem de tokens, custos.",
            type: "tool",
            status: "coming-soon",
            tags: ["OpenAI", "Anthropic", "API"],
          },
          {
            id: 4,
            label: "Embeddings & Representações Vetoriais",
            description:
              "Como texto vira número. Embeddings, similaridade coseno, busca semântica. A base do RAG.",
            type: "concept",
            status: "coming-soon",
            tags: ["Embeddings", "Vetores"],
          },
        ],
      },
      {
        number: "02",
        title: "Construção",
        nodes: [
          {
            id: 5,
            label: "Prompt Engineering Avançado",
            description:
              "Few-shot, chain-of-thought, system prompts, role-playing, structured output. A diferença entre um LLM ruim e um bom é o prompt.",
            type: "concept",
            status: "coming-soon",
            tags: ["Prompts", "Chain-of-Thought"],
          },
          {
            id: 6,
            label: "Bancos de Dados Vetoriais",
            description:
              "Pinecone, Qdrant, Chroma. Como armazenar e buscar embeddings em escala. A infraestrutura do RAG.",
            type: "tool",
            status: "coming-soon",
            tags: ["Pinecone", "Qdrant", "Chroma"],
          },
          {
            id: 7,
            label: "RAG: Retrieval-Augmented Generation",
            description:
              "Faça o LLM responder sobre seus documentos. O padrão mais aplicado no mercado: busca + geração.",
            type: "concept",
            status: "coming-soon",
            tags: ["RAG", "Busca Semântica"],
          },
          {
            id: 8,
            label: "LangChain / LlamaIndex",
            description:
              "Frameworks de orquestração para LLMs. Chains, retrievers, memory, document loaders. Como construir mais rápido.",
            type: "tool",
            status: "coming-soon",
            tags: ["LangChain", "LlamaIndex"],
          },
        ],
      },
      {
        number: "03",
        title: "Avançado",
        nodes: [
          {
            id: 9,
            label: "Agentes de IA Autônomos",
            description:
              "ReAct, Tool Use, planejamento de tarefas. Como criar agentes que usam ferramentas e tomam decisões em múltiplos passos.",
            type: "concept",
            status: "coming-soon",
            tags: ["Agentes", "Tool Use", "ReAct"],
          },
          {
            id: 10,
            label: "Fine-tuning & PEFT/LoRA",
            description:
              "Como especializar um modelo no seu domínio com poucos dados. LoRA, QLoRA, Unsloth. Quando vale a pena vs. RAG.",
            type: "tool",
            status: "coming-soon",
            tags: ["Fine-tuning", "LoRA", "PEFT"],
          },
          {
            id: 11,
            label: "Avaliação de LLMs",
            description:
              "Como medir se seu sistema de IA está funcionando. RAGAS, LLM-as-judge, métricas de faithfulness e relevância.",
            type: "concept",
            status: "coming-soon",
            tags: ["RAGAS", "Avaliação"],
          },
          {
            id: 12,
            label: "IA Multi-Modal",
            description:
              "Modelos que entendem imagens, áudio e texto juntos. GPT-4V, Gemini, CLIP. A próxima fronteira do campo.",
            type: "concept",
            status: "coming-soon",
            tags: ["Multi-Modal", "Visão"],
          },
        ],
      },
      {
        number: "04",
        title: "Projeto Final",
        nodes: [
          {
            id: 13,
            label: "Chatbot com RAG sobre Documentos",
            description:
              "Um assistente que responde perguntas sobre um conjunto de documentos reais. Ingestão, embedding, busca vetorial, geração e interface. Portfólio real.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Projeto Real"],
          },
        ],
      },
    ],
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────── */

const PHASE_COLORS = ["#0f62fe", "#0353e9", "#002d9c", "#001d6c"];

function nodeTypeIcon(type: NodeType) {
  if (type === "concept") return <BookOpen className="h-3.5 w-3.5" />;
  if (type === "tool") return <Wrench className="h-3.5 w-3.5" />;
  return <Star className="h-3.5 w-3.5" />;
}

function nodeTypeLabel(type: NodeType) {
  if (type === "concept") return "Conceito";
  if (type === "tool") return "Ferramenta";
  return "Projeto";
}

/* ── Roadmap Node Card ────────────────────────────────────────────────── */

function NodeCard({
  node,
  side,
  index,
  phaseColor,
  isLast,
}: {
  node: RoadmapNode;
  side: "left" | "right";
  index: number;
  phaseColor: string;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isProject = node.type === "project";

  return (
    <div className="relative flex items-start" style={{ minHeight: 72 }}>
      {/* ─ Vertical connector line (hidden on last node) ─ */}
      {!isLast && (
        <div
          className="absolute"
          style={{
            left: "calc(50% - 1px)",
            top: 36,
            bottom: 0,
            width: 2,
            background:
              "repeating-linear-gradient(to bottom, #e0e0e0 0px, #e0e0e0 6px, transparent 6px, transparent 12px)",
          }}
        />
      )}

      {/* ─ Center dot ─ */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{
          left: "50%",
          top: 16,
          transform: "translateX(-50%)",
          width: isProject ? 36 : 24,
          height: isProject ? 36 : 24,
          borderRadius: isProject ? 0 : "50%",
          backgroundColor: isProject ? phaseColor : "#ffffff",
          border: `2px solid ${phaseColor}`,
        }}
      >
        {isProject ? (
          <Star className="h-4 w-4 text-white" />
        ) : (
          <span
            className="font-mono font-bold"
            style={{ fontSize: 9, color: phaseColor }}
          >
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* ─ Card on left side ─ */}
      <div
        className="w-1/2 pr-6"
        style={{ paddingRight: side === "left" ? 32 : undefined }}
      >
        {side === "left" && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full text-right group"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <div
              className="inline-block w-full border p-4 text-right transition-colors hover:border-current"
              style={{
                backgroundColor: open ? "#f4f4f4" : "#ffffff",
                borderColor: open ? phaseColor : "#e0e0e0",
              }}
            >
              <div
                className="flex items-center justify-end gap-1.5 mb-1"
                style={{ color: phaseColor, opacity: 0.75 }}
              >
                {nodeTypeIcon(node.type)}
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-mono, monospace)" }}
                >
                  {nodeTypeLabel(node.type)}
                </span>
              </div>
              <p className="text-sm font-semibold leading-tight" style={{ color: "#161616" }}>
                {node.label}
              </p>
              {node.status === "coming-soon" && (
                <div className="flex items-center justify-end gap-1 mt-2">
                  <Lock className="h-3 w-3" style={{ color: "#8d8d8d" }} />
                  <span
                    className="text-[9px] uppercase tracking-widest"
                    style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    Em breve
                  </span>
                </div>
              )}
            </div>
            {open && (
              <div
                className="border border-t-0 p-4 text-right"
                style={{ borderColor: phaseColor, backgroundColor: "#fafafa" }}
              >
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#525252" }}>
                  {node.description}
                </p>
                {node.tags && (
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {node.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-2 py-0.5 font-semibold"
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          backgroundColor: "#edf5ff",
                          color: "#0043ce",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </button>
        )}
      </div>

      {/* ─ Card on right side ─ */}
      <div className="w-1/2 pl-6" style={{ paddingLeft: side === "right" ? 32 : undefined }}>
        {side === "right" && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full text-left group"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <div
              className="inline-block w-full border p-4 text-left transition-colors hover:border-current"
              style={{
                backgroundColor: open ? "#f4f4f4" : "#ffffff",
                borderColor: open ? phaseColor : "#e0e0e0",
              }}
            >
              <div
                className="flex items-center gap-1.5 mb-1"
                style={{ color: phaseColor, opacity: 0.75 }}
              >
                {nodeTypeIcon(node.type)}
                <span
                  className="text-[9px] font-semibold uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-mono, monospace)" }}
                >
                  {nodeTypeLabel(node.type)}
                </span>
              </div>
              <p className="text-sm font-semibold leading-tight" style={{ color: "#161616" }}>
                {node.label}
              </p>
              {node.status === "coming-soon" && (
                <div className="flex items-center gap-1 mt-2">
                  <Lock className="h-3 w-3" style={{ color: "#8d8d8d" }} />
                  <span
                    className="text-[9px] uppercase tracking-widest"
                    style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    Em breve
                  </span>
                </div>
              )}
            </div>
            {open && (
              <div
                className="border border-t-0 p-4 text-left"
                style={{ borderColor: phaseColor, backgroundColor: "#fafafa" }}
              >
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#525252" }}>
                  {node.description}
                </p>
                {node.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {node.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[9px] px-2 py-0.5 font-semibold"
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          backgroundColor: "#edf5ff",
                          color: "#0043ce",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Mobile Node Card ─────────────────────────────────────────────────── */

function NodeCardMobile({
  node,
  index,
  phaseColor,
  isLast,
}: {
  node: RoadmapNode;
  index: number;
  phaseColor: string;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isProject = node.type === "project";

  return (
    <div className="relative flex gap-4 pl-6">
      {/* ─ Left vertical line ─ */}
      {!isLast && (
        <div
          className="absolute"
          style={{
            left: 11,
            top: 28,
            bottom: 0,
            width: 2,
            background:
              "repeating-linear-gradient(to bottom, #e0e0e0 0px, #e0e0e0 6px, transparent 6px, transparent 12px)",
          }}
        />
      )}

      {/* ─ Left dot ─ */}
      <div
        className="absolute z-10 flex items-center justify-center shrink-0"
        style={{
          left: 0,
          top: 14,
          width: isProject ? 24 : 22,
          height: isProject ? 24 : 22,
          borderRadius: isProject ? 0 : "50%",
          backgroundColor: isProject ? phaseColor : "#ffffff",
          border: `2px solid ${phaseColor}`,
        }}
      >
        {isProject ? (
          <Star className="h-3 w-3 text-white" />
        ) : (
          <span
            className="font-mono font-bold"
            style={{ fontSize: 8, color: phaseColor }}
          >
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* ─ Card ─ */}
      <div className="flex-1 mb-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full text-left"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <div
            className="border p-3.5 w-full transition-colors"
            style={{
              backgroundColor: open ? "#f4f4f4" : "#ffffff",
              borderColor: open ? phaseColor : "#e0e0e0",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div
                  className="flex items-center gap-1.5 mb-1"
                  style={{ color: phaseColor, opacity: 0.75 }}
                >
                  {nodeTypeIcon(node.type)}
                  <span
                    className="text-[9px] font-semibold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {nodeTypeLabel(node.type)}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "#161616" }}>
                  {node.label}
                </p>
              </div>
              {open ? (
                <ChevronUp className="h-4 w-4 shrink-0" style={{ color: "#8d8d8d" }} />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "#8d8d8d" }} />
              )}
            </div>
          </div>
          {open && (
            <div
              className="border border-t-0 p-3.5 text-left"
              style={{ borderColor: phaseColor, backgroundColor: "#fafafa" }}
            >
              <p className="text-xs leading-relaxed mb-3" style={{ color: "#525252" }}>
                {node.description}
              </p>
              {node.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {node.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] px-2 py-0.5 font-semibold"
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        backgroundColor: "#edf5ff",
                        color: "#0043ce",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Main Export ──────────────────────────────────────────────────────── */

export function RoadmapVisual() {
  const [activeTrack, setActiveTrack] = useState(0);
  const track = TRACKS[activeTrack];

  let globalNodeIndex = 0;

  return (
    <div>
      {/* ── Track selector tabs ── */}
      <div
        className="flex border-b overflow-x-auto"
        style={{ borderColor: "#e0e0e0", backgroundColor: "#f4f4f4" }}
      >
        {TRACKS.map((t, i) => {
          const Icon = t.icon;
          const active = i === activeTrack;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTrack(i)}
              className="flex items-center gap-2.5 px-5 py-4 whitespace-nowrap text-sm font-semibold transition-colors border-b-2 shrink-0"
              style={{
                borderBottomColor: active ? "#0f62fe" : "transparent",
                color: active ? "#0f62fe" : "#525252",
                backgroundColor: active ? "#ffffff" : "transparent",
                cursor: "pointer",
                background: active ? "#ffffff" : "transparent",
                border: "none",
                borderBottom: `2px solid ${active ? "#0f62fe" : "transparent"}`,
              }}
            >
              <Icon className="h-4 w-4" />
              <span
                className="text-[10px] font-bold"
                style={{ fontFamily: "var(--font-mono, monospace)", color: active ? "#0f62fe" : "#8d8d8d" }}
              >
                {t.number}
              </span>
              {t.title}
            </button>
          );
        })}
      </div>

      {/* ── Track header ── */}
      <div
        className="px-4 md:px-8 py-8 border-b"
        style={{ borderColor: "#e0e0e0", backgroundColor: "#ffffff" }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-[10px] uppercase tracking-[0.28em] mb-2"
            style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
          >
            Trilha {track.number}
          </p>
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#161616" }}>
            {track.title}
          </h2>
          <p className="text-sm" style={{ color: "#525252" }}>
            {track.subtitle}
          </p>
        </div>
      </div>

      {/* ── Visual roadmap ── */}
      <div className="px-4 md:px-8 py-12" style={{ backgroundColor: "#fafafa" }}>
        <div className="mx-auto max-w-2xl">

          {/* START marker */}
          <div className="flex justify-center mb-8">
            <div
              className="flex items-center gap-2 px-5 py-2 font-bold text-xs uppercase tracking-widest"
              style={{
                backgroundColor: "#161616",
                color: "#ffffff",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              ▶ INÍCIO
            </div>
          </div>

          {track.phases.map((phase, phaseIdx) => {
            const color = PHASE_COLORS[phaseIdx] ?? "#0f62fe";

            return (
              <div key={phase.number}>
                {/* ── Phase header marker ── */}
                <div className="relative flex items-center justify-center my-6">
                  {/* line behind */}
                  <div
                    className="absolute w-full"
                    style={{ height: 1, backgroundColor: "#e0e0e0" }}
                  />
                  <div
                    className="relative z-10 flex items-center gap-2 px-4 py-1.5"
                    style={{ backgroundColor: color }}
                  >
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.24em] text-white"
                      style={{ fontFamily: "var(--font-mono, monospace)" }}
                    >
                      FASE {phase.number} · {phase.title.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* ── Desktop: zigzag nodes ── */}
                <div className="relative hidden md:block">
                  {/* Vertical center line */}
                  <div
                    className="absolute"
                    style={{
                      left: "50%",
                      top: 0,
                      bottom: 0,
                      width: 2,
                      transform: "translateX(-50%)",
                      background:
                        "repeating-linear-gradient(to bottom, #e0e0e0 0px, #e0e0e0 6px, transparent 6px, transparent 12px)",
                    }}
                  />
                  <div className="flex flex-col gap-4 pb-4">
                    {phase.nodes.map((node, nodeIdx) => {
                      globalNodeIndex++;
                      const side: "left" | "right" = nodeIdx % 2 === 0 ? "left" : "right";
                      const isLastInPhase =
                        nodeIdx === phase.nodes.length - 1 &&
                        phaseIdx === track.phases.length - 1;

                      return (
                        <NodeCard
                          key={node.id}
                          node={node}
                          side={side}
                          index={globalNodeIndex}
                          phaseColor={color}
                          isLast={isLastInPhase}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* ── Mobile: single column ── */}
                <div className="relative md:hidden pb-2">
                  {phase.nodes.map((node, nodeIdx) => {
                    globalNodeIndex++;
                    const isLastInPhase =
                      nodeIdx === phase.nodes.length - 1 &&
                      phaseIdx === track.phases.length - 1;
                    return (
                      <NodeCardMobile
                        key={node.id}
                        node={node}
                        index={globalNodeIndex}
                        phaseColor={color}
                        isLast={isLastInPhase}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* FINISH marker */}
          <div className="flex justify-center mt-8">
            <div
              className="flex items-center gap-2 px-5 py-2 font-bold text-xs uppercase tracking-widest"
              style={{
                backgroundColor: "#0f62fe",
                color: "#ffffff",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              ★ CERTIFICADO
            </div>
          </div>

          {/* Legenda */}
          <div
            className="mt-10 p-4 border flex flex-wrap gap-5 justify-center"
            style={{ borderColor: "#e0e0e0", backgroundColor: "#ffffff" }}
          >
            {[
              { icon: <BookOpen className="h-3.5 w-3.5" />, label: "Conceito" },
              { icon: <Wrench className="h-3.5 w-3.5" />, label: "Ferramenta / Tech" },
              { icon: <Star className="h-3.5 w-3.5" />, label: "Projeto Final" },
              { icon: <Lock className="h-3.5 w-3.5" />, label: "Em breve" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span style={{ color: "#525252" }}>{item.icon}</span>
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "#525252", fontFamily: "var(--font-mono, monospace)" }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA abaixo do roadmap */}
      <div
        className="px-4 md:px-8 py-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: "#e0e0e0", backgroundColor: "#ffffff" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "#161616" }}>
            Pronto para começar?
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#8d8d8d" }}>
            Os cursos estão em construção. Crie sua conta e seja notificado.
          </p>
        </div>
        <Link
          href="/cadastro"
          className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm shrink-0"
          style={{ backgroundColor: "#0f62fe", color: "#ffffff", textDecoration: "none" }}
        >
          Criar conta gratuita <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
