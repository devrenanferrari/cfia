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
        title: "Fundamentos de Programação",
        nodes: [
          {
            id: 1,
            label: "Lógica de Programação & Algoritmos",
            description:
              "Variáveis, condicionais, loops, funções e recursão — o vocabulário básico que torna todo o resto possível. Aqui você aprende a decompor problemas em partes menores, escrever pseudocódigo antes de código real e analisar a complexidade de tempo e espaço (notação O grande). Exercícios práticos com desafios progressivos em LeetCode-style para solidificar o raciocínio lógico antes de entrar em qualquer biblioteca.",
            type: "concept",
            status: "coming-soon",
            tags: ["Python", "Lógica", "Algoritmos", "Complexidade"],
          },
          {
            id: 2,
            label: "Python do Zero ao Avançado",
            description:
              "A linguagem principal de IA e ML — você vai usá-la em absolutamente tudo nesta trilha. Cobrimos tipos primitivos, listas, tuplas, dicionários, sets, compreensões de lista, funções de alta ordem (map, filter, reduce), classes e herança, tratamento de exceções, módulos, e por fim async/await para chamadas concorrentes. Também abordamos dataclasses, typing hints, e boas práticas de código limpo que diferenciam um script descartável de um código que vai para produção.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "OOP", "Async", "Type Hints", "Dataclasses"],
          },
          {
            id: 3,
            label: "Estruturas de Dados & Complexidade",
            description:
              "Arrays, listas ligadas, pilhas, filas, árvores binárias, heaps, tabelas hash e grafos — cada estrutura resolve um tipo diferente de problema, e escolher a errada custa performance. Você aprende quando usar cada uma, como implementar do zero para entender os mecanismos internos, e como reconhecer qual estrutura está por trás de cada operação de ML (um índice vetorial é essencialmente uma árvore KD; um grafo de dependências é um DAG). Sem isso, otimizações de pipeline virão aos chutes.",
            type: "concept",
            status: "coming-soon",
            tags: ["Python", "Algoritmos", "Big O", "Grafos", "Hash Maps"],
          },
          {
            id: 4,
            label: "Git & Fluxo de Trabalho em Equipe",
            description:
              "Controle de versão não é opcional — é o que separa um experimento solo de um projeto colaborativo. Cobrimos commits atômicos, branching strategies (Gitflow, trunk-based), resolução de conflitos de merge, rebase interativo, tags e releases, e pull requests com code review. Você aprende também conventional commits (feat:, fix:, chore:) e como manter um histórico limpo e legível que facilita bisect quando algo quebra em produção.",
            type: "tool",
            status: "coming-soon",
            tags: ["Git", "GitHub", "CI/CD", "Conventional Commits"],
          },
          {
            id: 5,
            label: "Terminal & Shell Scripting",
            description:
              "Engenheiros de IA passam muito tempo no terminal — navegando entre servidores, rodando treinamentos, inspecionando logs, movendo datasets. Você aprende navegação avançada, pipes e redirecionamento, variáveis de ambiente, scripts bash que automatizam tarefas repetitivas, cron jobs para agendamento, e utilitários como grep, awk, sed, jq para processar outputs. Em ambientes de cloud sem GUI, o terminal é sua única interface.",
            type: "tool",
            status: "coming-soon",
            tags: ["Bash", "Linux", "Shell Script", "Cron", "Terminal"],
          },
          {
            id: 6,
            label: "Ambiente de Desenvolvimento Profissional",
            description:
              "Configurar o ambiente certo desde o início evita horas de debug em conflitos de dependência. Você aprende a gerenciar versões de Python com pyenv, isolar projetos com virtualenv e poetry (incluindo pyproject.toml), trabalhar com Jupyter notebooks de forma reproduzível, configurar VS Code com extensões de produtividade para Python/IA, e usar o debugger com breakpoints em vez de print(). Um ambiente bem configurado é multiplicador de velocidade.",
            type: "tool",
            status: "coming-soon",
            tags: ["pyenv", "Poetry", "Jupyter", "VS Code", "Debugging"],
          },
        ],
      },
      {
        number: "02",
        title: "Matemática para IA",
        nodes: [
          {
            id: 7,
            label: "Álgebra Linear Aplicada",
            description:
              "Matrizes e vetores são a linguagem dos modelos de IA — um dataset é uma matriz, um embedding é um vetor, uma camada neural é uma multiplicação matricial. Você aprende operações essenciais: transposição, multiplicação, inversa, determinante, decomposição SVD, autovetores e autovalores. O foco é na intuição geométrica (o que significa multiplicar dois vetores?) e na conexão direta com o que acontece dentro de uma rede neural.",
            type: "concept",
            status: "coming-soon",
            tags: ["Matemática", "NumPy", "Vetores", "Matrizes", "SVD"],
          },
          {
            id: 8,
            label: "Cálculo & Gradientes",
            description:
              "O gradiente descendente — o coração do treinamento de redes neurais — é cálculo aplicado. Você aprende derivadas parciais, a regra da cadeia (que é exatamente o que o backpropagation implementa), gradiente, jacobiano e hessiano. Não para provar teoremas, mas para entender por que o learning rate importa, o que acontece quando gradientes explodem ou somem, e como diagnosticar esses problemas em um treinamento real.",
            type: "concept",
            status: "coming-soon",
            tags: ["Cálculo", "Gradiente", "Backpropagation", "NumPy"],
          },
          {
            id: 9,
            label: "Probabilidade & Estatística",
            description:
              "Modelos de ML são, em essência, sistemas probabilísticos — toda predição é uma distribuição de probabilidade. Você aprende distribuições (normal, bernoulli, multinomial, poisson), esperança e variância, o teorema de Bayes e como ele fundamenta algoritmos como Naive Bayes e inferência variacional, máxima verossimilhança (MLE) e estimação MAP. Entender isso muda como você interpreta saídas de modelos e quando confiar (ou não) neles.",
            type: "concept",
            status: "coming-soon",
            tags: ["Probabilidade", "Distribuições", "Bayes", "MLE", "SciPy"],
          },
          {
            id: 10,
            label: "Otimização Matemática",
            description:
              "Treinar uma rede neural é um problema de otimização: minimizar uma função de perda. Você aprende gradiente descendente clássico, SGD com mini-batches, momentum, RMSProp, Adam e AdamW — entendendo a intuição por trás de cada variante e quando preferir uma sobre outra. Também cobrimos learning rate schedules (step decay, cosine annealing, warm-up), que são críticos para obter o melhor resultado em treinamentos longos.",
            type: "concept",
            status: "coming-soon",
            tags: ["SGD", "Adam", "Learning Rate", "Otimização"],
          },
          {
            id: 11,
            label: "NumPy & Computação Vetorizada",
            description:
              "NumPy é a infraestrutura de todas as bibliotecas de ML em Python — PyTorch, TensorFlow e scikit-learn usam NumPy por baixo. Você aprende arrays n-dimensionais, operações element-wise, broadcasting (como operações entre arrays de shapes diferentes funcionam), indexação booleana, stacking e reshape. A diferença entre código vetorizado e loops Python pode ser de 100x em performance — essencial para processar datasets grandes.",
            type: "tool",
            status: "coming-soon",
            tags: ["NumPy", "Broadcasting", "Vetorização", "Arrays"],
          },
        ],
      },
      {
        number: "03",
        title: "Machine Learning Clássico",
        nodes: [
          {
            id: 12,
            label: "Fundamentos de Machine Learning",
            description:
              "O que significa um modelo 'aprender'? Aqui você constrói a base conceitual: a diferença entre treino, validação e teste (e por que confundir esses três causa problemas sérios), o bias-variance tradeoff, o que é overfitting e underfitting na prática, regularização L1 e L2, e o conceito de generalização. Você também aprende a montar um pipeline de experimentação reproducível, que é a habilidade mais subestimada em ML.",
            type: "concept",
            status: "coming-soon",
            tags: ["Scikit-learn", "ML", "Overfitting", "Regularização", "Pipeline"],
          },
          {
            id: 13,
            label: "Modelos de Regressão",
            description:
              "Regressão linear não é simples — ela é o modelo que você usa quando quer entender relações causais, não apenas prever. Você aprende regressão linear simples e múltipla, Ridge (L2), Lasso (L1, que faz seleção de features automaticamente), Elastic Net, e regressão polinomial. Além dos algoritmos, você aprende a interpretar coeficientes, verificar premissas do modelo (homocedasticidade, normalidade dos resíduos) e saber quando regressão linear não é a escolha certa.",
            type: "tool",
            status: "coming-soon",
            tags: ["Regressão Linear", "Ridge", "Lasso", "Sklearn", "Interpretação"],
          },
          {
            id: 14,
            label: "Modelos de Classificação",
            description:
              "Regressão logística, KNN, Decision Trees e SVMs — cada um com hipóteses, pontos fortes e fracos distintos. Você aprende a usar cada modelo com scikit-learn, mas mais importante: entende quando cada um é apropriado. Decision Trees são interpretáveis mas overfitam facilmente; SVMs funcionam bem com dados de alta dimensão mas são lentos com muitos exemplos. O objetivo é sair do 'usar o que conheço' para 'escolher o certo para o problema'.",
            type: "tool",
            status: "coming-soon",
            tags: ["Logistic Regression", "KNN", "Decision Tree", "SVM", "Sklearn"],
          },
          {
            id: 15,
            label: "Ensemble: Random Forest, XGBoost, LightGBM",
            description:
              "Os modelos que dominam a maioria das competições de dados estruturados. Random Forest usa bagging de árvores para reduzir variância; XGBoost e LightGBM usam gradient boosting sequencial, onde cada árvore corrige os erros da anterior. Você aprende a tunar hiperparâmetros (max_depth, n_estimators, learning rate, subsample), usar early stopping para evitar overfitting, e entender feature importance para interpretar o que o modelo aprendeu. Na prática, XGBoost resolve 70% dos problemas de dados tabulares.",
            type: "tool",
            status: "coming-soon",
            tags: ["XGBoost", "LightGBM", "Random Forest", "Ensemble", "Gradient Boosting"],
          },
          {
            id: 16,
            label: "Aprendizado Não-Supervisionado",
            description:
              "Quando você não tem labels — que é a maioria dos dados do mundo real. K-means para segmentação de clientes, DBSCAN para detectar anomalias sem definir o número de clusters, PCA para reduzir dimensionalidade e visualizar datasets de alta dimensão, t-SNE e UMAP para exploração visual de embeddings. Você também aprende clustering hierárquico com dendrogramas e como validar resultados quando não há ground truth.",
            type: "concept",
            status: "coming-soon",
            tags: ["K-means", "DBSCAN", "PCA", "t-SNE", "UMAP", "Clustering"],
          },
          {
            id: 17,
            label: "Avaliação Rigorosa de Modelos",
            description:
              "Acurácia sozinha mente — especialmente com classes desbalanceadas. Você aprende todo o arsenal de métricas: precision, recall, F1-score, AUC-ROC, AUC-PR, log loss, RMSE, MAE, R². Mais importante: aprende a escolher a métrica certa para o problema (detecção de fraude quer recall alto; spam filter quer precision alta). Cross-validation estratificado, bootstrap, e como construir intervalos de confiança para suas métricas completam o módulo.",
            type: "concept",
            status: "coming-soon",
            tags: ["AUC-ROC", "F1", "Cross-Validation", "Métricas", "Confusion Matrix"],
          },
          {
            id: 18,
            label: "Pipeline de ML com Scikit-learn",
            description:
              "Um experimento de ML sem pipeline bem estruturado vira um spaghetti de código em semanas. Você aprende a construir pipelines com sklearn (Pipeline, ColumnTransformer), fazer GridSearchCV e RandomizedSearchCV para busca de hiperparâmetros, joblib para paralelização, e como salvar e carregar modelos com pickle/joblib de forma segura. O módulo culmina na construção de um pipeline de produção reproducível que vai do CSV bruto à predição em segundos.",
            type: "tool",
            status: "coming-soon",
            tags: ["Sklearn Pipeline", "GridSearchCV", "Joblib", "Preprocessing", "ColumnTransformer"],
          },
        ],
      },
      {
        number: "04",
        title: "Deep Learning",
        nodes: [
          {
            id: 19,
            label: "Redes Neurais: Do Neurônio à Rede",
            description:
              "O perceptron, a camada densa, funções de ativação (ReLU, GELU, Sigmoid, Tanh) e por que a escolha importa; inicialização de pesos (Xavier, He) e o problema do vanishing gradient. Você constrói uma rede neural do zero em NumPy puro — sem framework — para entender exatamente o que backpropagation faz internamente. Só depois de entender o mecanismo você vai para o PyTorch. Esse conhecimento é o que diferencia quem usa modelos de quem os entende.",
            type: "concept",
            status: "coming-soon",
            tags: ["Redes Neurais", "Backpropagation", "Ativações", "Inicialização"],
          },
          {
            id: 20,
            label: "PyTorch: Fundamentos Completos",
            description:
              "O framework de referência para pesquisa e produção de IA. Você aprende tensors e operações, autograd (como o grafo computacional é construído e como os gradientes fluem), nn.Module para construir arquiteturas modulares, DataLoader e Dataset para pipelines de dados eficientes, e o training loop completo com forward pass, loss, backward e optimizer step. Também cobrimos torchsummary para inspecionar modelos, mixed precision training (torch.cuda.amp) e como usar GPU de forma correta.",
            type: "tool",
            status: "coming-soon",
            tags: ["PyTorch", "Autograd", "nn.Module", "DataLoader", "CUDA", "AMP"],
          },
          {
            id: 21,
            label: "Regularização & Técnicas de Treinamento",
            description:
              "Redes neurais grandes overfitam facilmente — regularização é o que permite treiná-las com dados limitados. Você aprende Dropout (e por que usar durante treino mas não inferência), Batch Normalization e Layer Normalization (e quando usar cada um), weight decay, early stopping com paciência, e gradient clipping para instabilidades. Também cobrimos data augmentation como regularização implícita e como monitorar métricas de treino vs. validação para diagnosticar problemas cedo.",
            type: "concept",
            status: "coming-soon",
            tags: ["Dropout", "Batch Norm", "Weight Decay", "Early Stopping", "Regularização"],
          },
          {
            id: 22,
            label: "CNNs & Transfer Learning",
            description:
              "Redes convolucionais são a base de visão computacional — e entender como conv2d, pooling e feature maps funcionam é essencial mesmo na era dos Vision Transformers. Você aprende arquiteturas clássicas (LeNet, VGG, ResNet, EfficientNet) e modernas, depois parte para transfer learning: como usar modelos pré-treinados no ImageNet, congelar camadas, adaptar o classifier para seu problema com poucos dados, e fine-tuning progressivo (descongelar camadas gradualmente).",
            type: "tool",
            status: "coming-soon",
            tags: ["CNN", "ResNet", "EfficientNet", "Transfer Learning", "torchvision"],
          },
          {
            id: 23,
            label: "Debugging de Redes Neurais",
            description:
              "Treinar uma rede neural que não converge é frustrante sem saber o que verificar. Você aprende um checklist sistemático: inspecionar loss curves (underfitting vs. overfitting), verificar gradient flow com hooks do PyTorch, detectar dead neurons (quando ReLU mata um neurônio para sempre), diagnosticar exploding/vanishing gradients com grad norm tracking, e fazer sanity checks (overfit intencional em 1 batch antes de treinar no dataset completo). Esse módulo vai te salvar dezenas de horas.",
            type: "concept",
            status: "coming-soon",
            tags: ["Debugging", "Loss Curves", "Gradient Flow", "PyTorch Hooks", "Diagnóstico"],
          },
        ],
      },
      {
        number: "05",
        title: "Visão Computacional & NLP",
        nodes: [
          {
            id: 24,
            label: "OpenCV & Processamento de Imagens",
            description:
              "Antes de passar uma imagem para um modelo, você precisa entender o que está manipulando. OpenCV cobre leitura/escrita em múltiplos formatos, operações de cor (BGR→RGB, HSV, grayscale), filtros (blur gaussiano, canny edge detection, morfológicos), transformações geométricas (resize, crop, flip, rotação, perspectiva) e histogramas. Data augmentation manual com Albumentations para criar datasets maiores a partir de poucos exemplos. A maioria dos bugs em pipelines de visão vem de pré-processamento errado.",
            type: "tool",
            status: "coming-soon",
            tags: ["OpenCV", "Albumentations", "Imagens", "Augmentation", "Pré-processamento"],
          },
          {
            id: 25,
            label: "Object Detection com YOLO",
            description:
              "YOLO (You Only Look Once) é o algoritmo de detecção de objetos mais usado na indústria por sua velocidade e precisão. Você aprende a anatomia do modelo (backbone, neck, head), conceitos de anchors e anchor-free detection, Non-Maximum Suppression, e métricas específicas de detecção (mAP@50, mAP@50-95). Treina um modelo do zero no COCO e fine-tune no seu próprio dataset com Roboflow + YOLOv8. Deploy com ONNX para inferência em CPU.",
            type: "tool",
            status: "coming-soon",
            tags: ["YOLOv8", "Object Detection", "mAP", "Roboflow", "ONNX", "Ultralytics"],
          },
          {
            id: 26,
            label: "Segmentação de Imagens",
            description:
              "Detecção te diz onde está o objeto; segmentação te diz exatamente quais pixels pertencem a ele. Você aprende segmentação semântica (toda pixel tem uma classe) com DeepLab/SegFormer, instância (cada objeto individual) com Mask R-CNN, e panóptica. O SAM (Segment Anything Model) da Meta é coberto como ferramenta de anotação e zero-shot segmentation. Aplicações práticas: contagem de células em imagens médicas, inspeção de qualidade industrial.",
            type: "tool",
            status: "coming-soon",
            tags: ["Segmentação", "U-Net", "SAM", "Mask R-CNN", "SegFormer"],
          },
          {
            id: 27,
            label: "Fundamentos de NLP com Transformers",
            description:
              "De bag-of-words até BERT em um módulo. Você entende a evolução: tokenização (BPE, WordPiece), word embeddings (Word2Vec, GloVe), RNNs e LSTMs (por que falhavam com sequências longas), e finalmente a arquitetura Transformer com self-attention e positional encoding. Com Hugging Face Transformers, você fine-tuna BERT para classificação de textos, NER (named entity recognition) e Q&A, entendendo cada etapa do pipeline.",
            type: "tool",
            status: "coming-soon",
            tags: ["BERT", "Transformers", "Hugging Face", "NLP", "Fine-tuning", "Tokenização"],
          },
          {
            id: 28,
            label: "Modelos Multimodais",
            description:
              "A fronteira atual de IA é a fusão de modalidades — modelos que entendem imagem + texto juntos. Você aprende CLIP (zero-shot image classification conectando texto e imagem com embeddings no mesmo espaço), BLIP-2 para VQA (visual question answering), e como construir pipelines que combinam um detector de objetos com um LLM para gerar descrições automáticas. Fundamentos para trabalhar com GPT-4V e Gemini Vision.",
            type: "concept",
            status: "coming-soon",
            tags: ["CLIP", "Multimodal", "VQA", "BLIP-2", "GPT-4V"],
          },
        ],
      },
      {
        number: "06",
        title: "Produção & Deploy",
        nodes: [
          {
            id: 29,
            label: "APIs de Inferência com FastAPI",
            description:
              "Seu modelo treinado não vale nada se ninguém consegue chamá-lo. FastAPI é o framework de escolha para expor modelos como APIs — tipagem com Pydantic garante validação automática de inputs, o OpenAPI docs gerado automaticamente facilita integração, e a performance assíncrona suporta múltiplas requisições simultâneas. Você constrói uma API com: endpoint de predição, validação de schema, carregamento do modelo na inicialização (não em cada request), rate limiting, e autenticação via API key.",
            type: "tool",
            status: "coming-soon",
            tags: ["FastAPI", "Pydantic", "REST", "Async", "API Key", "OpenAPI"],
          },
          {
            id: 30,
            label: "Docker: Containerizando Modelos",
            description:
              "O container resolve o problema 'funciona na minha máquina'. Você aprende a escrever Dockerfiles otimizados para ML (multi-stage builds para reduzir tamanho da imagem, .dockerignore, gerenciamento de dependências), docker-compose para orquestrar serviço de API + banco de dados localmente, e o fluxo de build → tag → push para um registry (Docker Hub, ECR). Um container bem construído vai de 2GB para 300MB — o que importa em custos de cloud.",
            type: "tool",
            status: "coming-soon",
            tags: ["Docker", "Dockerfile", "Multi-stage Build", "ECR", "Docker Compose"],
          },
          {
            id: 31,
            label: "Deploy em Cloud: AWS & GCP",
            description:
              "Com o container pronto, o próximo passo é colocá-lo em produção. Você aprende os serviços essenciais da AWS: EC2 para VMs, S3 para artefatos de modelo, ECS/Fargate para rodar containers sem gerenciar servidores, ECR para registry privado, e Application Load Balancer. No GCP, o Cloud Run é abordado como alternativa serverless. IAM, roles e policies são cobertos porque permissão mal configurada é a causa mais comum de incidentes em cloud.",
            type: "tool",
            status: "coming-soon",
            tags: ["AWS", "GCP", "ECS", "Fargate", "Cloud Run", "S3", "IAM"],
          },
          {
            id: 32,
            label: "Otimização de Modelos para Inferência",
            description:
              "Um modelo PyTorch treinado raramente é o mais rápido para inferência. Você aprende ONNX como formato intermediário para portabilidade, TorchScript para serialização e otimização de grafos, quantização INT8 (reduz tamanho 4x com mínima perda de acurácia), pruning de pesos, e TensorRT para aceleração máxima em GPUs NVIDIA. Em produção, a diferença entre 50ms e 5ms de latência pode determinar a viabilidade do produto.",
            type: "tool",
            status: "coming-soon",
            tags: ["ONNX", "TensorRT", "Quantização", "TorchScript", "Latência", "Otimização"],
          },
          {
            id: 33,
            label: "Monitoramento & Observabilidade",
            description:
              "Um modelo sem monitoramento é uma caixa-preta em produção — você não sabe se está errando até o cliente reclamar. Você aprende logs estruturados com JSON (para facilitar queries), Prometheus para métricas de latência e throughput, Grafana para dashboards, e alertas via PagerDuty/Slack. Para modelos especificamente: monitoramento de distribuição de inputs (data drift), distribuição de outputs (model drift), e taxa de erro por segmento. O stack cobre desde o básico até distributed tracing com OpenTelemetry.",
            type: "tool",
            status: "coming-soon",
            tags: ["Prometheus", "Grafana", "Logs Estruturados", "OpenTelemetry", "Data Drift"],
          },
        ],
      },
      {
        number: "07",
        title: "Projetos Finais",
        nodes: [
          {
            id: 34,
            label: "API de Visão Computacional do Zero ao Deploy",
            description:
              "Projeto completo de portfólio: você escolhe um problema de visão computacional (detecção de defeitos em peças, classificação de documentos, contagem de objetos), coleta ou usa um dataset público, treina um modelo YOLOv8 ou CNN customizada, otimiza com ONNX, expõe via FastAPI, containeriza com Docker e faz deploy na AWS ECS com monitoramento via Prometheus. O resultado é uma API em produção real que você pode mostrar em entrevistas com link ao vivo.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Visão Computacional", "AWS", "FastAPI", "Docker", "Produção"],
          },
          {
            id: 35,
            label: "Sistema de Detecção de Anomalias em Tempo Real",
            description:
              "Anomalia detection é um dos problemas mais comuns na indústria: fraude financeira, falha de equipamentos, intrusão em redes. Você constrói um autoencoder com PyTorch para detectar anomalias em séries temporais industriais (dataset NASA MSDS ou similar), expõe como streaming endpoint com FastAPI e WebSockets, e implementa alertas quando a taxa de anomalias ultrapassa um threshold. Inclui dashboard em tempo real com Grafana.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Anomaly Detection", "Autoencoder", "Streaming", "Tempo Real"],
          },
          {
            id: 36,
            label: "Pipeline de NLP: Classificação & Extração",
            description:
              "NLP aplicado ao mundo real: você constrói um pipeline de processamento de textos em português que classifica reclamações de consumidores (Reclame Aqui dataset), extrai entidades nomeadas (empresa, produto, local) e prioriza tickets automaticamente. Fine-tune BERTimbau (BERT em português) via Hugging Face, compare com XGBoost + TF-IDF como baseline, e implante o melhor modelo como microserviço. Projeto com impacto direto em automação de atendimento.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "NLP", "BERTimbau", "Hugging Face", "Português", "Extração"],
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
        title: "Fundamentos Analíticos",
        nodes: [
          {
            id: 1,
            label: "Python para Análise de Dados",
            description:
              "Pandas é o Excel do cientista de dados — mas infinitamente mais poderoso. Você aprende Series e DataFrame do zero: seleção (loc, iloc, query), agrupamento com groupby e agg, merge/join entre tabelas, reshaping com pivot_table e melt, e tratamento de datas com DatetimeIndex. NumPy cobre operações vetorizadas para cálculos em grandes volumes sem loops lentos. O módulo termina com um projeto de análise completa em um dataset real de 1 milhão de linhas.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "Pandas", "NumPy", "DataFrame", "GroupBy"],
          },
          {
            id: 2,
            label: "SQL do Básico ao Avançado",
            description:
              "Dados vivem em bancos relacionais, e saber SQL fluentemente é inegociável para qualquer cientista de dados. Você começa com SELECT, WHERE, ORDER BY e GROUP BY, avança para JOINs (inner, left, right, full, self), subqueries correlacionadas, CTEs (WITH), e termina com window functions (ROW_NUMBER, RANK, LAG, LEAD, SUM OVER PARTITION) — as ferramentas que separam análises mediocres de análises sofisticadas. Tudo praticado no PostgreSQL com datasets reais.",
            type: "tool",
            status: "coming-soon",
            tags: ["SQL", "PostgreSQL", "Window Functions", "CTE", "JOINs"],
          },
          {
            id: 3,
            label: "Estatística Descritiva & Probabilidade",
            description:
              "Estatística é a lente com que o cientista de dados enxerga os dados. Você aprende medidas de tendência central (média, mediana, moda) e de dispersão (variância, desvio padrão, IQR), distribuições de probabilidade essenciais (normal, Bernoulli, Poisson, exponencial) e como reconhecê-las em dados reais, correlação (Pearson, Spearman) e por que correlação não implica causalidade. O objetivo é que você nunca olhe para um número sem contexto estatístico.",
            type: "concept",
            status: "coming-soon",
            tags: ["Estatística", "Distribuições", "Correlação", "Probabilidade", "SciPy"],
          },
          {
            id: 4,
            label: "Visualização de Dados",
            description:
              "Um insight que não é comunicado visualmente raramente gera ação. Você aprende a filosofia de visualização (escolher o tipo certo de gráfico para cada pergunta), Matplotlib para controle total de cada elemento, Seaborn para gráficos estatísticos elegantes com menos código, e Plotly para dashboards interativos que você pode compartilhar online. Cobrimos princípios de design (escala, cor, anotações) e as armadilhas clássicas que enganam audiências (eixos truncados, gráficos de pizza, dual axes).",
            type: "tool",
            status: "coming-soon",
            tags: ["Matplotlib", "Seaborn", "Plotly", "Visualização", "Dashboard"],
          },
          {
            id: 5,
            label: "Limpeza & Qualidade de Dados",
            description:
              "Na prática, 70–80% do tempo de um cientista de dados é gasto tratando dados — e a qualidade do modelo é diretamente limitada pela qualidade dos dados. Você aprende estratégias para missing values (MCAR, MAR, MNAR e quando usar exclusão vs. imputação), detecção e tratamento de outliers (IQR, Z-score, Isolation Forest), duplicatas, inconsistências de formato (datas, moedas, strings), e como documentar decisões de limpeza para reproducibilidade.",
            type: "concept",
            status: "coming-soon",
            tags: ["Data Quality", "Missing Values", "Outliers", "Limpeza", "Pandas"],
          },
          {
            id: 6,
            label: "Jupyter & Reproducibilidade",
            description:
              "Análises reproducíveis são análises confiáveis. Você aprende a estruturar notebooks de forma que qualquer pessoa possa re-executar do zero e obter os mesmos resultados: seeds fixos, environments documentados com requirements.txt/conda, parametrização com papermill, execução em batch com nbconvert, e quando migrar do notebook para scripts Python modulares. Também cobrimos ydata-profiling (ex-pandas-profiling) para gerar relatórios de dataset automaticamente.",
            type: "tool",
            status: "coming-soon",
            tags: ["Jupyter", "Reproducibilidade", "ydata-profiling", "Papermill", "nbconvert"],
          },
        ],
      },
      {
        number: "02",
        title: "Análise & Inferência Avançada",
        nodes: [
          {
            id: 7,
            label: "EDA Sistemática",
            description:
              "Análise exploratória não é navegar aleatoriamente — é um processo estruturado de geração e teste de hipóteses. Você aprende um framework de 10 etapas: entender o domínio, mapear o schema, verificar integridade, analisar univariadas, bivariadas, multivariadas, identificar padrões temporais, segmentações relevantes, anomalias e, finalmente, formular perguntas de negócio respondíveis com os dados disponíveis. Aplicado a um dataset de e-commerce com 5 tabelas relacionadas.",
            type: "concept",
            status: "coming-soon",
            tags: ["EDA", "Pandas", "Plotly", "Hipóteses", "Análise Exploratória"],
          },
          {
            id: 8,
            label: "Estatística Inferencial & Testes de Hipótese",
            description:
              "Como tirar conclusões sobre uma população a partir de uma amostra — e saber quando você pode confiar nessas conclusões. Você aprende intervalos de confiança, o conceito de p-valor (e os equívocos mais comuns sobre ele), testes t (1 amostra, 2 amostras independentes, pareado), teste qui-quadrado para variáveis categóricas, testes não-paramétricos (Mann-Whitney, Kruskal-Wallis) quando as premissas paramétricas são violadas, e ANOVA para comparar múltiplos grupos.",
            type: "concept",
            status: "coming-soon",
            tags: ["Testes de Hipótese", "p-valor", "ANOVA", "SciPy", "Inferência"],
          },
          {
            id: 9,
            label: "Desenho e Análise de Experimentos A/B",
            description:
              "Empresas de produto tomam decisões com A/B tests — e cientistas de dados que entendem os trade-offs têm muito mais influência. Você aprende a calcular o tamanho de amostra necessário (para não parar o teste cedo por falso positivo), randomização e grupos de controle, significância estatística vs. significância prática (effect size), o problema de múltiplas comparações (p-hacking), sequential testing e Bayesian A/B testing como alternativa mais intuitiva. Com estudos de caso de Google, Netflix e Booking.",
            type: "concept",
            status: "coming-soon",
            tags: ["A/B Testing", "Power Analysis", "Bayesian", "Experimentos", "Effect Size"],
          },
          {
            id: 10,
            label: "Feature Engineering Profundo",
            description:
              "A feature engineering é onde domínio de negócio encontra ML — e frequentemente é o que separa 80% de acurácia de 95%. Você aprende encoding de variáveis categóricas (one-hot, ordinal, target encoding, embeddings para cardinalidade alta), scaling (StandardScaler, MinMax, RobustScaler — e quando usar cada um), criação de features polinomiais e de interação, tratamento de datas (extração de dia da semana, estações, feriados), e técnicas de seleção de features (correlação, mutual information, RFE, SHAP).",
            type: "concept",
            status: "coming-soon",
            tags: ["Feature Engineering", "Encoding", "Scaling", "Seleção", "Sklearn"],
          },
          {
            id: 11,
            label: "Análise de Coorte, Funil & Métricas de Produto",
            description:
              "Ciência de dados em produto digital gira em torno de entender comportamento de usuários ao longo do tempo. Você aprende análise de coorte (como grupos de usuários adquiridos em períodos diferentes se comportam), análise de funil de conversão (onde os usuários desistem), retenção (D1, D7, D30) e churn, LTV (Lifetime Value) e CAC (Custo de Aquisição), e como construir um painel de métricas de produto que suporte decisões de roadmap.",
            type: "concept",
            status: "coming-soon",
            tags: ["Coorte", "Funil", "Retenção", "LTV", "Churn", "Produto"],
          },
          {
            id: 12,
            label: "Web Scraping & Coleta de Dados via API",
            description:
              "Nem sempre os dados chegam organizados em um CSV — às vezes você precisa buscá-los. Você aprende requests para chamar APIs REST (autenticação, paginação, rate limiting, tratamento de erros), BeautifulSoup para parsear HTML e extrair dados estruturados, Selenium/Playwright para páginas com JavaScript dinâmico, e como respeitar termos de serviço e robots.txt. Projeto: construir um pipeline de coleta que monitora preços de produtos no mercado livre.",
            type: "tool",
            status: "coming-soon",
            tags: ["Web Scraping", "APIs", "Requests", "BeautifulSoup", "Selenium"],
          },
        ],
      },
      {
        number: "03",
        title: "Machine Learning Aplicado",
        nodes: [
          {
            id: 13,
            label: "Regressão, Classificação & Seleção de Modelos",
            description:
              "Modelos clássicos ainda resolvem a maioria dos problemas de negócio — e escolher o errado desperdiça semanas. Você aprende regressão linear e logística, KNN, árvores de decisão e SVM, com foco em quando cada um é apropriado. A parte mais importante: como comparar modelos rigorosamente com cross-validation estratificado, entender o que as métricas realmente medem, e construir baselines sólidas antes de tentar modelos complexos.",
            type: "tool",
            status: "coming-soon",
            tags: ["Scikit-learn", "Regressão", "Classificação", "Cross-Validation", "Baseline"],
          },
          {
            id: 14,
            label: "Ensemble: XGBoost, LightGBM & CatBoost",
            description:
              "Se você só pudesse aprender um algoritmo para dados tabulares, seria gradient boosting. XGBoost definiu o estado-da-arte em competições de dados por anos; LightGBM é 10x mais rápido para datasets grandes; CatBoost lida nativamente com variáveis categóricas. Você aprende as diferenças internas de cada um, como tunar hiperparâmetros com Optuna (bayesian optimization), usar early stopping, e interpretar feature importance e SHAP values para explicar predições a stakeholders.",
            type: "tool",
            status: "coming-soon",
            tags: ["XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "Gradient Boosting"],
          },
          {
            id: 15,
            label: "Séries Temporais: ARIMA, Prophet & LSTM",
            description:
              "Previsão de demanda, estoque, receita e preços são problemas de séries temporais — e cada empresa que vende algo precisa resolvê-los. Você aprende decomposição de séries (tendência, sazonalidade, ruído), ARIMA e SARIMA para séries estacionárias, Prophet (da Meta) para séries com múltiplas sazonalidades e feriados, e LSTMs para capturar padrões complexos. Avaliação com backtesting temporal (nunca use shuffle em séries temporais!) e métricas como MAE, MAPE, RMSE.",
            type: "concept",
            status: "coming-soon",
            tags: ["Time Series", "ARIMA", "Prophet", "LSTM", "Backtesting", "Sazonalidade"],
          },
          {
            id: 16,
            label: "Interpretabilidade: SHAP, LIME & Partial Dependence",
            description:
              "Um modelo que ninguém confia nunca é adotado — e para ganhar confiança você precisa explicar as predições. SHAP (SHapley Additive exPlanations) decompõe cada predição individualmente em contribuições de features, com garantias matemáticas de consistência. LIME cria aproximações locais interpretáveis. Partial Dependence Plots mostram o efeito marginal de cada feature. Você aprende a usar cada ferramenta e a comunicar os resultados para audiências não-técnicas com visualizações adequadas.",
            type: "concept",
            status: "coming-soon",
            tags: ["SHAP", "LIME", "Interpretabilidade", "Explicabilidade", "PDP"],
          },
          {
            id: 17,
            label: "Sistemas de Recomendação",
            description:
              "Netflix, Spotify, Amazon — todos usam sistemas de recomendação para aumentar engajamento e receita. Você aprende collaborative filtering (baseado em comportamento de usuários similares), content-based filtering (baseado em atributos dos itens), matrix factorization com SVD e ALS, e modelos híbridos que combinam as duas abordagens. Implementação com Surprise e LightFM, avaliação com precision@k, recall@k e NDCG, e como lidar com o cold start problem para novos usuários e itens.",
            type: "tool",
            status: "coming-soon",
            tags: ["Recomendação", "Collaborative Filtering", "Matrix Factorization", "LightFM", "NDCG"],
          },
          {
            id: 18,
            label: "MLflow para Cientistas de Dados",
            description:
              "Sem rastreamento de experimentos, você perde o controle de qual modelo foi treinado com quais parâmetros e dados — um problema que fica crítico após 10+ experimentos. MLflow tracking registra automaticamente parâmetros, métricas e artefatos; o model registry versiona e gerencia o ciclo de vida dos modelos (staging → production); e o serve permite comparar runs lado a lado. Você integra MLflow em um notebook de análise existente e constrói um workflow de experimentação estruturado.",
            type: "tool",
            status: "coming-soon",
            tags: ["MLflow", "Experimentos", "Model Registry", "Rastreamento", "Reprodutibilidade"],
          },
        ],
      },
      {
        number: "04",
        title: "Engenharia de Dados & BI",
        nodes: [
          {
            id: 19,
            label: "Data Warehousing & Modelagem Dimensional",
            description:
              "Para fazer análises em grande escala, você precisa entender como dados são organizados em data warehouses. Você aprende o esquema estrela (fatos e dimensões), esquema floco de neve, slowly changing dimensions (SCD tipos 1, 2, 3), e as diferenças entre OLTP (transacional) e OLAP (analítico). Prática no BigQuery e Redshift. Entender modelagem dimensional é o que permite você trabalhar com dados de qualidade em vez de fazer gambiarras de JOIN eternas.",
            type: "concept",
            status: "coming-soon",
            tags: ["Data Warehouse", "Modelagem Dimensional", "BigQuery", "Redshift", "OLAP"],
          },
          {
            id: 20,
            label: "dbt: Transformações SQL com Qualidade de Software",
            description:
              "dbt (data build tool) trouxe engenharia de software para transformações SQL: versionamento com Git, testes automatizados de dados, documentação gerada, e modularidade com refs. Você aprende a estruturar um projeto dbt (staging → intermediate → marts), escrever testes de schema (not_null, unique, accepted_values), criar macros reutilizáveis, e integrar com BigQuery ou Snowflake. Com dbt, as mesmas boas práticas que o desenvolvimento de software usa chegam para as transformações de dados.",
            type: "tool",
            status: "coming-soon",
            tags: ["dbt", "SQL", "Transformações", "Testes de Dados", "BigQuery"],
          },
          {
            id: 21,
            label: "Apache Spark & PySpark",
            description:
              "Quando os dados não cabem na memória RAM, você precisa de processamento distribuído. Spark processa dados em cluster, distribuindo o trabalho entre múltiplos nós. Você aprende RDDs (a base), DataFrames da Spark SQL (a forma moderna), transformações lazy vs. actions, otimização com explain() e particionamento, e PySpark para escrever jobs em Python. Casos de uso: processar logs de 100GB, transformar um data lake de terabytes, feature engineering distribuído.",
            type: "tool",
            status: "coming-soon",
            tags: ["Apache Spark", "PySpark", "Processamento Distribuído", "Big Data", "Databricks"],
          },
          {
            id: 22,
            label: "Dashboards com Power BI & Metabase",
            description:
              "Insights de dados só geram valor quando chegam às pessoas certas no formato certo. Power BI é o padrão corporativo: você aprende a conectar fontes de dados, criar relacionamentos entre tabelas, escrever medidas em DAX (SUM, CALCULATE, DIVIDE, ALL), construir visuais interativos e publicar para o serviço. Metabase é a alternativa open-source para times técnicos. O módulo cobre também princípios de design de dashboard: hierarquia visual, contexto comparativo e drill-down.",
            type: "tool",
            status: "coming-soon",
            tags: ["Power BI", "DAX", "Metabase", "Dashboard", "BI"],
          },
        ],
      },
      {
        number: "05",
        title: "DS Avançado",
        nodes: [
          {
            id: 23,
            label: "Detecção de Anomalias",
            description:
              "Anomalia detection sem labels é um dos problemas mais práticos e menos ensinados em cursos de DS. Você aprende Isolation Forest (aleatoriza partições até isolar pontos anômalos), One-Class SVM, Local Outlier Factor, e autoencoders para dados de alta dimensão. Aplicações: detecção de fraude em transações financeiras, falha preditiva em sensores industriais, intrusão em logs de acesso. Avaliação é um desafio especial quando positivos são raros — você aprende AUC-PR e calibração de threshold.",
            type: "concept",
            status: "coming-soon",
            tags: ["Anomaly Detection", "Isolation Forest", "Autoencoder", "Fraude", "One-Class SVM"],
          },
          {
            id: 24,
            label: "NLP para Cientistas de Dados",
            description:
              "Muito dado corporativo é texto não-estruturado: reviews, emails, suporte, contratos. Você aprende análise de sentimentos (TextBlob, VADER, BERT fine-tuned), extração de entidades (spaCy NER), topic modeling com LDA e BERTopic para descobrir temas em grandes coleções de texto, e similaridade semântica com sentence-transformers. Foco na aplicação prática: como processar 100k reviews de produto para identificar os problemas mais frequentes.",
            type: "tool",
            status: "coming-soon",
            tags: ["NLP", "spaCy", "Sentimentos", "Topic Modeling", "BERTopic", "Sentence Transformers"],
          },
          {
            id: 25,
            label: "Análise de Grafos & Redes",
            description:
              "Muitos problemas do mundo real são naturalmente grafos: redes sociais, transações financeiras, supply chains, grafos de conhecimento. NetworkX permite criar e analisar grafos em Python: medidas de centralidade (degree, betweenness, pagerank), detecção de comunidades (Louvain, Girvan-Newman), shortest paths. Para grafos grandes, PyG (PyTorch Geometric) e Graph Neural Networks. Caso de uso clássico: detectar redes de fraude onde as conexões são tão reveladoras quanto as transações.",
            type: "concept",
            status: "coming-soon",
            tags: ["Grafos", "NetworkX", "Comunidades", "PageRank", "GNN", "PyG"],
          },
          {
            id: 26,
            label: "Causalidade: além da Correlação",
            description:
              "A pergunta mais poderosa em ciência de dados não é 'o que está correlacionado?' mas 'o que causa o quê?' Você aprende o framework de Potential Outcomes de Rubin, DAGs causais (Directed Acyclic Graphs) com DoWhy, propensity score matching para estudos observacionais, diferenças em diferenças (DiD) para avaliar impacto de intervenções sem randomização, e Regression Discontinuity Design. Habilidade rara que posiciona o DS como parceiro estratégico de negócio.",
            type: "concept",
            status: "coming-soon",
            tags: ["Causalidade", "DoWhy", "Propensity Score", "DiD", "DAG", "Inferência Causal"],
          },
        ],
      },
      {
        number: "06",
        title: "Comunicação & Impacto",
        nodes: [
          {
            id: 27,
            label: "Storytelling com Dados",
            description:
              "O insight mais correto do mundo não gera ação se não for comunicado de forma convincente. Você aprende a estrutura da narrativa de dados: contexto → conflito → resolução, como escolher o visual certo para cada mensagem (não existe um gráfico universalmente superior), como simplificar sem mentir, e como adaptar a apresentação para a audiência (CEO vs. engenheiro vs. time de produto). Exercício prático: transformar um notebook bagunçado em uma apresentação executiva de 10 slides.",
            type: "concept",
            status: "coming-soon",
            tags: ["Storytelling", "Comunicação", "Apresentação", "Executivos", "Narrativa"],
          },
          {
            id: 28,
            label: "DS como Parceiro de Produto",
            description:
              "Cientistas de dados que entendem o produto têm 10x mais impacto do que os que ficam no notebook. Você aprende a linguagem de produto: discovery, hipóteses, OKRs, roadmap, north star metric. Como formular perguntas de negócio em problemas de dados, priorizar o que medir, e fechar o ciclo entre análise e decisão. Inclui frameworks como RICE para priorização e como comunicar incerteza estatística para PMs que não têm background técnico.",
            type: "concept",
            status: "coming-soon",
            tags: ["Produto", "OKRs", "Discovery", "North Star", "Métricas", "Impacto"],
          },
          {
            id: 29,
            label: "Ética, Privacidade & Fairness em Dados",
            description:
              "Modelos não são neutros — eles herdam e amplificam os vieses presentes nos dados de treinamento. Você aprende a detectar fairness issues com Fairlearn e AI Fairness 360 (paridade demográfica, equalização de odds), anonimização e pseudonimização, os requisitos da LGPD e GDPR que impactam projetos de DS (consentimento, portabilidade, direito ao esquecimento), e como conduzir uma avaliação de impacto de privacidade antes de colocar um modelo em produção.",
            type: "concept",
            status: "coming-soon",
            tags: ["Ética", "Fairness", "LGPD", "GDPR", "Privacidade", "Viés"],
          },
        ],
      },
      {
        number: "07",
        title: "Projetos Finais",
        nodes: [
          {
            id: 30,
            label: "Pipeline de Detecção de Fraude",
            description:
              "Um projeto end-to-end que replica o que bancos e fintechs fazem: ingestão de transações via SQL, análise exploratória com EDA sistemática, feature engineering (tempo desde última transação, padrão geográfico, frequência por merchant), treinamento de XGBoost com classes desbalanceadas (SMOTE, class_weight), avaliação por AUC-PR (não acurácia!), interpretação com SHAP e deploy como API FastAPI. Inclui um relatório executivo com as principais features preditoras.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Fraude", "XGBoost", "SHAP", "SMOTE", "Desbalanceamento"],
          },
          {
            id: 31,
            label: "Sistema de Recomendação de Produtos",
            description:
              "Usando o dataset público do Olist (e-commerce brasileiro), você constrói um sistema de recomendação híbrido: collaborative filtering com LightFM para usuários recorrentes, content-based com embeddings de descrição de produto para cold start, e um ranking final que combina relevância com margem de lucro. O sistema é avaliado com precision@10 e NDCG, com análise de fairness verificando se algumas categorias de produto são sistematicamente sub-recomendadas.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Recomendação", "LightFM", "Olist", "Hybrid", "NDCG"],
          },
          {
            id: 32,
            label: "Dashboard de Métricas com Predição de Churn",
            description:
              "Um projeto de produto completo: você analisa dados de uma empresa SaaS fictícia, identifica as principais alavancas de churn via análise de coorte e A/B tests, treina um modelo de predição de churn (probabilidade de cancelamento nos próximos 30 dias) com LightGBM, cria um dashboard interativo em Streamlit que mostra clientes em risco com as principais features SHAP, e apresenta um relatório executivo com recomendações de ações de retenção priorizadas por ROI esperado.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Churn", "Streamlit", "LightGBM", "Produto", "SaaS"],
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
        title: "Fundamentos de Engenharia",
        nodes: [
          {
            id: 1,
            label: "Python & Bash para Engenharia de Software",
            description:
              "MLOps é engenharia de software aplicada a ML — e isso exige Python além de notebooks. Você aprende Python focado em scripts de produção: argparse para CLIs, logging estruturado, tratamento robusto de erros, typing completo, dataclasses e Pydantic para validação de configurações. Bash cobre navegação avançada, pipes, redirecionamento, scripts de automação, monitoramento de processos com ps/top/htop, análise de logs com grep/awk/sed, e variáveis de ambiente — a interface real com servidores em cloud.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "Bash", "Linux", "Logging", "Argparse", "Pydantic"],
          },
          {
            id: 2,
            label: "Docker Completo: Do Básico ao Multi-stage",
            description:
              "Containers são a unidade atômica de deploy em MLOps — tudo roda em Docker. Você aprende a anatomia de um Dockerfile (FROM, RUN, COPY, ENV, CMD, ENTRYPOINT), layers e como o cache funciona para builds rápidos, multi-stage builds para reduzir imagens de 5GB para 300MB, docker-compose para orquestrar múltiplos serviços localmente, volumes para persistência, networking entre containers, e healthchecks. Um Dockerfile ruim em produção pode aumentar o tempo de deploy em 10x.",
            type: "tool",
            status: "coming-soon",
            tags: ["Docker", "Dockerfile", "Multi-stage", "Docker Compose", "Containers", "Registry"],
          },
          {
            id: 3,
            label: "Linux & Sistemas para ML Engineers",
            description:
              "Seus modelos vão rodar em servidores Linux — entender o sistema operacional é fundamental para debugging e performance. Você aprende gerenciamento de processos (ps, kill, systemd), sistema de arquivos e permissões (chmod, chown, links simbólicos), gerenciamento de memória e CPU (htop, vmstat, iostat), networking básico (curl, netcat, ss, iptables), variáveis de ambiente e PATH, e como configurar um servidor fresh do zero para ML (CUDA drivers, nvidia-docker, environment).",
            type: "concept",
            status: "coming-soon",
            tags: ["Linux", "Processos", "Permissões", "Networking", "CUDA", "nvidia-docker"],
          },
          {
            id: 4,
            label: "ML Básico: O que você vai Operar",
            description:
              "Para fazer MLOps bem, você precisa entender profundamente o que está operando. Você aprende o ciclo completo de ML: coleta e limpeza de dados, feature engineering, treino com scikit-learn, avaliação com cross-validation, serialização de modelos (pickle, joblib, ONNX). O foco não é se tornar um cientista de dados — é entender o suficiente para identificar data drift, diagnosticar degradação de modelo, e conversar de igual para igual com o time de DS.",
            type: "concept",
            status: "coming-soon",
            tags: ["Scikit-learn", "ML", "ONNX", "Pickle", "Feature Engineering", "Avaliação"],
          },
          {
            id: 5,
            label: "Git Avançado & GitHub Actions",
            description:
              "GitOps — tratar infraestrutura e configuração como código versionado — é o paradigma dominante em MLOps. Você aprende Git além do básico: rebase interativo, cherry-pick, bisect para encontrar o commit que quebrou a produção, hooks para validação automática antes de commit. GitHub Actions cobre workflows de CI/CD: rodar testes em cada PR, build e push de imagens Docker, deploy automático em staging, e disparar retreinamento de modelos quando novos dados chegam.",
            type: "tool",
            status: "coming-soon",
            tags: ["Git", "GitHub Actions", "CI/CD", "GitOps", "Hooks", "Workflows"],
          },
          {
            id: 6,
            label: "Infraestrutura como Código com Terraform",
            description:
              "Criar recursos de cloud manualmente pelo console é frágil — Terraform permite declarar sua infraestrutura em código, versioná-la, e recriar ambientes idênticos em minutos. Você aprende HCL (HashiCorp Configuration Language), providers (AWS, GCP), resources e data sources, state management (local e remote no S3), módulos reutilizáveis, e o ciclo plan → apply → destroy. Projeto: subir toda a infraestrutura de um sistema de ML (VPC, ECS cluster, RDS, S3) com um único comando.",
            type: "tool",
            status: "coming-soon",
            tags: ["Terraform", "IaC", "AWS", "HCL", "State", "Infraestrutura"],
          },
        ],
      },
      {
        number: "02",
        title: "Orquestração & Pipelines",
        nodes: [
          {
            id: 7,
            label: "Apache Airflow: Orquestração de Pipelines",
            description:
              "Pipelines de ML envolvem muitas etapas com dependências complexas — Airflow gerencia isso. Você aprende DAGs (Directed Acyclic Graphs), operadores built-in (PythonOperator, BashOperator, DockerOperator), sensores para aguardar condições externas, XComs para passar dados entre tasks, backfill para reprocessar datas passadas, e como estruturar um pipeline de ML completo (ingestão → processamento → treino → validação → deploy). Boas práticas: DAGs idempotentes, alertas por email/Slack em falhas.",
            type: "tool",
            status: "coming-soon",
            tags: ["Airflow", "DAG", "Orquestração", "Pipelines", "Agendamento", "ETL"],
          },
          {
            id: 8,
            label: "MLflow: Rastreamento & Model Registry",
            description:
              "Sem rastreamento, você não sabe qual combinação de dados, features e hiperparâmetros gerou o melhor modelo — um problema crítico em escala. MLflow Tracking registra automaticamente runs com parâmetros, métricas e artefatos. O Model Registry centraliza versões de modelos com estágios (Staging, Production, Archived) e histórico de promoções. MLflow Projects encapsula código para execução reproduzível. Você configura um servidor MLflow central que o time inteiro compartilha.",
            type: "tool",
            status: "coming-soon",
            tags: ["MLflow", "Experiment Tracking", "Model Registry", "Reprodutibilidade", "Artefatos"],
          },
          {
            id: 9,
            label: "Feature Stores: Feast & Hopsworks",
            description:
              "O training-serving skew — diferença entre as features usadas no treino e as usadas em inferência — é uma das causas mais silenciosas de degradação de modelos em produção. Feature stores resolvem isso: um repositório centralizado que serve as mesmas features para treino (batch) e inferência (real-time). Você aprende Feast (open-source, integra com BigQuery/Redis) para definir feature views, materializá-las, e servir com point-in-time correctness — evitando data leakage.",
            type: "tool",
            status: "coming-soon",
            tags: ["Feature Store", "Feast", "Hopsworks", "Training-Serving Skew", "Point-in-Time"],
          },
          {
            id: 10,
            label: "DVC: Versionamento de Dados & Modelos",
            description:
              "Git versiona código — mas como versionar datasets de 50GB e modelos de 2GB? DVC (Data Version Control) resolve isso: armazena os dados no S3/GCS/Azure e salva apenas ponteiros no Git, permitindo reproduzir qualquer versão do experimento com git checkout + dvc pull. Você aprende pipelines DVC (dvc.yaml), cache compartilhado entre colaboradores, e comparação de métricas entre commits com dvc metrics diff. Essencial para reproducibilidade de experimentos em equipe.",
            type: "tool",
            status: "coming-soon",
            tags: ["DVC", "Versionamento", "S3", "Reprodutibilidade", "Data Pipeline"],
          },
          {
            id: 11,
            label: "Kubeflow Pipelines",
            description:
              "Para equipes que já usam Kubernetes, Kubeflow Pipelines oferece orquestração de ML nativa no cluster — cada etapa do pipeline roda em um container separado com recursos isolados. Você aprende a definir componentes reutilizáveis em Python, compor pipelines visualmente ou via código, gerenciar runs e experimentos no dashboard, e integrar com o Kubernetes scheduler para priorização de jobs de treino. Alternativa moderna ao Airflow quando a infraestrutura já é K8s.",
            type: "tool",
            status: "coming-soon",
            tags: ["Kubeflow", "Kubernetes", "ML Pipelines", "Componentes", "K8s"],
          },
        ],
      },
      {
        number: "03",
        title: "Kubernetes & Containers em Escala",
        nodes: [
          {
            id: 12,
            label: "Kubernetes Fundamentos para ML",
            description:
              "Kubernetes é o sistema operacional da cloud — e entender seus primitivos é fundamental para qualquer ML engineer sênior. Você aprende Pods (a menor unidade), Deployments (para stateless apps), Services (para networking interno e externo), ConfigMaps e Secrets, namespaces para isolamento, e RBAC para controle de acesso. Para ML especificamente: como pedir recursos de GPU no manifest, node selectors e taints/tolerations para garantir que jobs de treino rodem nos nós certos.",
            type: "tool",
            status: "coming-soon",
            tags: ["Kubernetes", "K8s", "Pods", "Deployments", "GPU", "RBAC"],
          },
          {
            id: 13,
            label: "Helm: Empacotamento de Aplicações K8s",
            description:
              "Gerenciar dezenas de manifests YAML manualmente é insustentável — Helm é o package manager do Kubernetes. Você aprende a estrutura de um chart (templates, values.yaml, helpers), como parametrizar deployments para diferentes ambientes (dev, staging, prod) com override de values, instalar charts de repositórios públicos (Bitnami, Artifact Hub), e criar seu próprio chart para deployar um modelo de ML com todas as configurações necessárias em um único comando helm install.",
            type: "tool",
            status: "coming-soon",
            tags: ["Helm", "Kubernetes", "Charts", "Templates", "Package Manager"],
          },
          {
            id: 14,
            label: "Treinamento Distribuído com PyTorch DDP",
            description:
              "Modelos grandes não cabem em uma única GPU — treinamento distribuído permite usar múltiplas GPUs e múltiplos nós em paralelo. Você aprende PyTorch DistributedDataParallel (DDP) para multi-GPU em um nó, como escalar para múltiplos nós com torchrun, gradient accumulation como alternativa quando a memória é limitada, e mixed precision training (FP16/BF16) para dobrar a velocidade e reduzir o uso de memória. Configuração de jobs de treino distribuído no Kubernetes com Kubeflow Training Operator.",
            type: "tool",
            status: "coming-soon",
            tags: ["PyTorch DDP", "Treinamento Distribuído", "Multi-GPU", "torchrun", "Mixed Precision"],
          },
          {
            id: 15,
            label: "GitOps com ArgoCD",
            description:
              "GitOps é o paradigma onde o estado desejado da infraestrutura e dos deployments é declarado em Git — e qualquer desvio é corrigido automaticamente. ArgoCD monitora repositórios Git e sincroniza o cluster Kubernetes continuamente. Você aprende a configurar Applications no ArgoCD, estratégias de rollout (Canary, Blue-Green), rollback automático com health checks, e como estruturar repositórios de configuração (monorepo vs. por ambiente). O resultado: zero deploy manual, auditoria completa no histórico Git.",
            type: "tool",
            status: "coming-soon",
            tags: ["ArgoCD", "GitOps", "Kubernetes", "Canary", "Blue-Green", "Rollback"],
          },
        ],
      },
      {
        number: "04",
        title: "Cloud & AWS para ML",
        nodes: [
          {
            id: 16,
            label: "AWS Fundamentos para ML Engineers",
            description:
              "AWS é a plataforma de cloud mais usada no mercado, e ML engineers precisam ser fluentes nos serviços essenciais. Você aprende EC2 (tipos de instância para treino: p3, p4, g4, spot instances para 70% de desconto), S3 para armazenamento de datasets e artefatos (lifecycle policies, versionamento, encryption), ECS/Fargate para containers sem gerenciar servidores, ECR para registry privado, VPC e security groups para isolamento de rede, e IAM com roles e policies de least privilege.",
            type: "tool",
            status: "coming-soon",
            tags: ["AWS", "EC2", "S3", "ECS", "Fargate", "IAM", "Spot Instances"],
          },
          {
            id: 17,
            label: "AWS SageMaker: Plataforma ML Gerenciada",
            description:
              "SageMaker é a plataforma ML end-to-end da AWS que abstrai infraestrutura para que você foque no modelo. Você aprende Training Jobs (treino gerenciado com containers customizados ou built-in), Processing Jobs (pré-processamento e avaliação), Endpoints para real-time inference com auto-scaling, Batch Transform para inferência em lote, Pipelines para orquestrar o fluxo completo, e Model Monitor para detectar drift automaticamente. Comparado com configurar tudo do zero, SageMaker reduz o time-to-production drasticamente.",
            type: "tool",
            status: "coming-soon",
            tags: ["SageMaker", "AWS", "Training Jobs", "Endpoints", "Pipelines", "Model Monitor"],
          },
          {
            id: 18,
            label: "GCP Vertex AI",
            description:
              "A plataforma ML unificada do Google Cloud — integração nativa com BigQuery e os melhores TPUs do mercado. Você aprende Vertex AI Workbench para notebooks gerenciados, Training com Custom Jobs e AutoML, Model Registry, Endpoints para serving, Pipelines (baseado em Kubeflow), e Feature Store. Para equipes que já usam BigQuery como data warehouse, Vertex AI elimina a movimentação de dados entre analytics e ML — BigQuery ML permite treinar modelos diretamente em SQL.",
            type: "tool",
            status: "coming-soon",
            tags: ["GCP", "Vertex AI", "BigQuery ML", "TPU", "AutoML", "Feature Store"],
          },
          {
            id: 19,
            label: "FinOps: Custos de ML em Cloud",
            description:
              "Um job de treino de LLM mal otimizado pode custar dezenas de milhares de dólares. FinOps para ML cobre: como usar Spot/Preemptible instances com checkpointing para 70% de economia, right-sizing de instâncias (a maioria dos engenheiros escolhe instâncias grandes demais), Reserved Instances para cargas de trabalho previsíveis, S3 Intelligent-Tiering para reduzir custos de armazenamento de datasets antigos, e como configurar budgets e alertas para não ser surpreendido na fatura. AWS Cost Explorer e GCP Billing são cobertos em profundidade.",
            type: "concept",
            status: "coming-soon",
            tags: ["FinOps", "Spot Instances", "Checkpointing", "Cost Explorer", "Budgets"],
          },
        ],
      },
      {
        number: "05",
        title: "Serving & Otimização de Modelos",
        nodes: [
          {
            id: 20,
            label: "Model Serving: do FastAPI ao Triton",
            description:
              "Diferentes modelos e diferentes requisitos de latência pedem diferentes soluções de serving. FastAPI é simples e flexível para protótipos e modelos com tráfego moderado. BentoML adiciona abstrações para ML (bento archives, runners, adaptive batching). Triton Inference Server é o padrão em produção de alta performance: suporta múltiplos frameworks (PyTorch, TensorRT, ONNX, TF) no mesmo servidor, model ensembles, dynamic batching, e métricas de utilização de GPU. Você aprende quando usar cada um.",
            type: "tool",
            status: "coming-soon",
            tags: ["Triton", "BentoML", "FastAPI", "Model Serving", "Dynamic Batching", "GPU"],
          },
          {
            id: 21,
            label: "Quantização, Pruning & ONNX",
            description:
              "Um modelo PyTorch treinado raramente é a forma mais eficiente de rodá-lo em produção. Quantização INT8 reduz o modelo em 4x e aumenta throughput 2-4x com mínima perda de acurácia — você aprende post-training quantization e quantization-aware training. Pruning remove pesos redundantes. ONNX é o formato intermediário universal que permite exportar de PyTorch e rodar em qualquer runtime (ONNX Runtime, TensorRT, CoreML). TensorRT é abordado para squeeze máximo de performance em GPUs NVIDIA.",
            type: "tool",
            status: "coming-soon",
            tags: ["Quantização", "ONNX", "TensorRT", "Pruning", "INT8", "Otimização"],
          },
          {
            id: 22,
            label: "A/B Testing e Canary Deployments de Modelos",
            description:
              "Colocar um novo modelo em 100% do tráfego de uma vez é arriscado — e impossível de medir se foi uma melhoria. Shadow deployment (rodar em paralelo sem servir respostas) valida performance antes da exposição. Canary releases expõem gradualmente (1% → 5% → 25% → 100%) com rollback automático se métricas degradam. Blue-green deployment mantém duas versões ativas para rollback instantâneo. Você configura tudo isso no Kubernetes com Argo Rollouts e métricas de negócio como critério de promoção.",
            type: "concept",
            status: "coming-soon",
            tags: ["A/B Testing", "Canary", "Shadow Deploy", "Blue-Green", "Argo Rollouts"],
          },
          {
            id: 23,
            label: "Batch vs Online Inference",
            description:
              "Nem todo modelo precisa responder em milliseconds — e a escolha do padrão de inferência tem impacto enorme em custo e arquitetura. Batch inference processa grandes volumes offline (ex: gerar recomendações para todos os usuários à meia-noite), muito mais barato e simples. Online inference responde em tempo real (ex: classificar uma transação em 50ms antes de aprovar). Você aprende quando usar cada um, como implementar batch inference com Spark/AWS Batch/SageMaker Batch Transform, e padrões de caching para reduzir latência em online inference.",
            type: "concept",
            status: "coming-soon",
            tags: ["Batch Inference", "Online Inference", "Latência", "Caching", "SageMaker", "Spark"],
          },
        ],
      },
      {
        number: "06",
        title: "Observabilidade & Confiabilidade",
        nodes: [
          {
            id: 24,
            label: "Monitoramento com Prometheus & Grafana",
            description:
              "Você não pode gerenciar o que não mede — e sistemas de ML em produção têm múltiplas camadas para monitorar. Prometheus coleta métricas via scraping de endpoints /metrics: latência de inferência (p50, p95, p99), throughput, erros, utilização de GPU/CPU. Grafana transforma essas métricas em dashboards acionáveis. Você aprende a instrumentar uma API FastAPI com prometheus-client, criar alertas com Alertmanager para PagerDuty/Slack, e construir um dashboard de SLO (Service Level Objectives).",
            type: "tool",
            status: "coming-soon",
            tags: ["Prometheus", "Grafana", "SLO", "Alertmanager", "Instrumentação", "Métricas"],
          },
          {
            id: 25,
            label: "Detecção de Data Drift & Model Drift",
            description:
              "Modelos degradam silenciosamente quando os dados de produção divergem do treino — o chamado concept drift. Evidently AI monitora distribuições estatísticas de features e outputs ao longo do tempo, detectando drift com testes estatísticos (KS test, PSI, chi-squared). NannyML detecta performance drift sem labels verdadeiros, usando confidence-based performance estimation. Você implementa um sistema completo de monitoramento que envia alertas quando o drift ultrapassa thresholds e agenda retreinamento automático.",
            type: "tool",
            status: "coming-soon",
            tags: ["Data Drift", "Evidently AI", "NannyML", "Concept Drift", "PSI", "KS Test"],
          },
          {
            id: 26,
            label: "Rastreamento Distribuído com OpenTelemetry",
            description:
              "Em sistemas de ML complexos — múltiplos microserviços, pipelines assíncronos, chamadas a feature stores — um request pode atravessar 10 serviços antes de retornar. Distributed tracing conecta todos esses saltos em um trace único, tornando possível identificar onde está a latência. OpenTelemetry é o padrão open-source para instrumentação (traces, métricas, logs com correlação). Você integra OTel no seu sistema de serving, exporta para Jaeger ou Tempo, e usa os traces para diagnosticar gargalos.",
            type: "tool",
            status: "coming-soon",
            tags: ["OpenTelemetry", "Distributed Tracing", "Jaeger", "Observabilidade", "Trace"],
          },
          {
            id: 27,
            label: "Incident Management & SRE para ML",
            description:
              "Todo sistema em produção vai falhar — a questão é quão rápido você detecta e resolve. Você aprende SLIs (métricas que medem saúde), SLOs (metas sobre essas métricas) e error budgets (quanto de degradação você tolera antes de parar features). Runbooks são documentos que descrevem como responder a alertas específicos — você escreve runbooks para os alerts mais comuns do seu sistema de ML. Postmortem sem culpa: como conduzir análise de causa raiz e extrair aprendizados que previnem a próxima falha.",
            type: "concept",
            status: "coming-soon",
            tags: ["SRE", "SLO", "Error Budget", "Runbooks", "Postmortem", "Incident Response"],
          },
        ],
      },
      {
        number: "07",
        title: "Projetos Finais",
        nodes: [
          {
            id: 28,
            label: "Pipeline MLOps Completo com CI/CD",
            description:
              "O projeto de portfólio definitivo de ML engineering: um sistema onde novos dados disparam automaticamente retreinamento via Airflow, o modelo é rastreado no MLflow, validado com testes automatizados, publicado no Model Registry, deployado via Kubernetes com Argo Rollouts em Canary release, monitorado com Prometheus+Grafana, e revertido automaticamente se o drift ultrapassar o threshold. Toda a infraestrutura provisionada com Terraform, todo o código versionado com GitOps.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "MLOps", "CI/CD", "Airflow", "MLflow", "Kubernetes", "Terraform"],
          },
          {
            id: 29,
            label: "Sistema de Serving de Alta Performance",
            description:
              "Você constrói um sistema capaz de servir 10.000 requisições por segundo com latência P99 abaixo de 100ms: modelo quantizado com TensorRT, servido via Triton Inference Server com dynamic batching, atrás de um load balancer NGINX, com caching de respostas no Redis para queries repetidas, auto-scaling horizontal no Kubernetes baseado em GPU utilization, e monitoramento completo via Prometheus. Load test com Locust comprova os números — resultado vai direto no portfólio.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Triton", "TensorRT", "Alta Performance", "Auto-scaling", "Locust"],
          },
          {
            id: 30,
            label: "Infraestrutura de ML Multi-Cloud com Terraform",
            description:
              "Você provisiona do zero toda a infraestrutura necessária para um sistema de ML em AWS e GCP: VPC, subnets, security groups, cluster EKS/GKE, node pools com GPUs, ECR/Artifact Registry, S3/GCS para artefatos, RDS/Cloud SQL para metadados, e secrets no AWS Secrets Manager/GCP Secret Manager. Tudo em módulos Terraform reutilizáveis com workspaces para dev/staging/prod. CI/CD para a própria infraestrutura com terraform plan em PRs e terraform apply no merge.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Terraform", "AWS", "GCP", "EKS", "GKE", "Multi-Cloud"],
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
        title: "Fundamentos de LLMs",
        nodes: [
          {
            id: 1,
            label: "Python para LLMs: Async, JSON & Streaming",
            description:
              "Trabalhar com LLMs via API tem padrões específicos que você usa todos os dias. Você aprende chamadas async com asyncio e aiohttp para processar múltiplos prompts em paralelo sem bloquear (a diferença de 10s para 1s em batches), manipulação robusta de JSON com validação via Pydantic (os LLMs às vezes retornam JSON malformado — você precisa lidar com isso), streaming de respostas com Server-Sent Events para exibir tokens em tempo real, e retries com exponential backoff para lidar com rate limits da API.",
            type: "tool",
            status: "coming-soon",
            tags: ["Python", "Async", "Pydantic", "Streaming", "API", "JSON"],
          },
          {
            id: 2,
            label: "Como Transformers e LLMs Funcionam",
            description:
              "LLMs não são caixas-pretas — e entender o mecanismo interno muda radicalmente como você os usa. Você aprende a arquitetura Transformer: self-attention (como cada token 'olha' para os outros), multi-head attention, positional encoding, e a intuição de por que esse design permite parallelismo durante treino. Depois: tokenização (BPE, SentencePiece, por que 'token ≠ palavra'), context window e suas limitações práticas, temperatura e sampling strategies (top-k, top-p, nucleus). Sem esse fundamento, você fica preso na superfície.",
            type: "concept",
            status: "coming-soon",
            tags: ["Transformers", "Self-Attention", "Tokenização", "Context Window", "Temperatura"],
          },
          {
            id: 3,
            label: "APIs de IA: OpenAI, Anthropic & Google",
            description:
              "As três maiores APIs de LLM têm diferenças significativas que impactam o que você constrói. Você aprende o schema de mensagens (system/user/assistant) e como cada provider o implementa, parâmetros críticos (temperature, top_p, max_tokens, stop sequences, logit_bias), contagem de tokens para estimar custos antes de chamar (tiktoken, anthropic-tokenizer), streaming de respostas, function calling/tool use em cada provider, e rate limits com estratégias de retry. Comparativo de modelos: custo × latência × capacidade para escolher o certo para cada caso.",
            type: "tool",
            status: "coming-soon",
            tags: ["OpenAI", "Anthropic", "Claude", "Gemini", "API", "Tool Use", "Custo"],
          },
          {
            id: 4,
            label: "Embeddings & Busca Semântica",
            description:
              "Embeddings são a tecnologia que conecta texto a matemática — e são a base de RAG, sistemas de recomendação de conteúdo, detecção de duplicatas e classificação sem labels. Você aprende o que embeddings representam geometricamente (textos similares = vetores próximos), como gerar com OpenAI text-embedding-3, sentence-transformers locais (multilingual para português), e modelos especializados. Similaridade coseno, produto interno, normalização L2. Construção de um buscador semântico do zero sem vector database — apenas NumPy — para entender os fundamentos.",
            type: "concept",
            status: "coming-soon",
            tags: ["Embeddings", "Sentence-Transformers", "Busca Semântica", "Coseno", "OpenAI"],
          },
          {
            id: 5,
            label: "Arquitetura Transformer em Profundidade",
            description:
              "Para quem quer ir além do uso e entender o design: como o encoder-only (BERT, para classificação e embeddings) difere do decoder-only (GPT, para geração) e do encoder-decoder (T5, para tradução e sumarização). Rotary Positional Embeddings (RoPE) que permitem contextos de 128k tokens. Group Query Attention (GQA) que reduz memória em inferência. Flash Attention para treinamento mais rápido. Mixture of Experts (MoE) como a arquitectura dos modelos mais eficientes. Conhecimento que te diferencia em entrevistas técnicas sênior.",
            type: "concept",
            status: "coming-soon",
            tags: ["Transformers", "RoPE", "Flash Attention", "MoE", "Arquitetura", "Atenção"],
          },
        ],
      },
      {
        number: "02",
        title: "Prompt Engineering",
        nodes: [
          {
            id: 6,
            label: "Prompts Fundamentais: Zero-shot, Few-shot & System",
            description:
              "A maioria das falhas com LLMs é falha de prompt, não falha do modelo. Zero-shot funciona quando a tarefa é clara e o modelo tem conhecimento suficiente; few-shot fornece exemplos no contexto para guiar formato e raciocínio. System prompts definem persona, tom, restrições e formato de saída — aprenda a escrevê-los com precisão cirúrgica. Você experimenta com múltiplos modelos (GPT-4o, Claude 3.5, Gemini) para entender diferenças de comportamento e por que o mesmo prompt pode funcionar em um e falhar em outro.",
            type: "concept",
            status: "coming-soon",
            tags: ["Prompts", "Zero-shot", "Few-shot", "System Prompt", "GPT-4o", "Claude"],
          },
          {
            id: 7,
            label: "Chain-of-Thought, Self-Consistency & Tree-of-Thoughts",
            description:
              "LLMs erram menos quando 'pensam em voz alta' antes de responder — isso é Chain-of-Thought (CoT). 'Vamos pensar passo a passo' é a versão simples; CoT com exemplos estruturados é a versão poderosa para problemas de raciocínio complexo. Self-Consistency amostra múltiplas respostas e agrega por votação, melhorando acurácia em matemática e lógica. Tree-of-Thoughts permite que o modelo explore múltiplos caminhos de raciocínio em paralelo — como um buscador de soluções. Benchmark comparativo de cada técnica em problemas reais.",
            type: "concept",
            status: "coming-soon",
            tags: ["Chain-of-Thought", "CoT", "Self-Consistency", "Tree-of-Thoughts", "Raciocínio"],
          },
          {
            id: 8,
            label: "Structured Output: JSON Mode & Instructor",
            description:
              "Extrair dados estruturados de LLMs de forma confiável é um dos casos de uso mais valiosos na indústria. JSON mode (OpenAI, Anthropic) garante que a saída seja JSON válido, mas não garante o schema. Instructor é a biblioteca que combina Pydantic com function calling para extrair dados tipados com validação automática e retries. Você aprende a extrair entidades, classificar documentos, preencher formulários, e transformar texto não-estruturado em registros de banco de dados — tudo com garantia de schema.",
            type: "tool",
            status: "coming-soon",
            tags: ["Structured Output", "JSON Mode", "Instructor", "Pydantic", "Extração"],
          },
          {
            id: 9,
            label: "Prompt Injection, Jailbreaks & Guardrails",
            description:
              "Se seu sistema aceita inputs de usuários, ele está vulnerável a prompt injection — usuários que tentam fazer o LLM ignorar suas instruções. Você aprende os principais vetores de ataque (direct injection, indirect via documentos externos, jailbreaks de persona), e as defesas: input sanitization, separação clara entre instrução e dados, NeMo Guardrails para políticas declarativas, Llama Guard para classificação de conteúdo, e output validation. Essencial antes de qualquer deploy em produção.",
            type: "concept",
            status: "coming-soon",
            tags: ["Prompt Injection", "Guardrails", "Segurança", "NeMo", "Llama Guard", "Defesa"],
          },
          {
            id: 10,
            label: "Gerenciamento & Versionamento de Prompts",
            description:
              "Prompts em produção mudam frequentemente — sem versionamento você perde controle de qual versão causou qual comportamento. Você aprende a tratar prompts como código: versionamento no Git, templates com Jinja2 para injeção de variáveis, testes automatizados que verificam se um prompt retorna o formato correto em inputs conhecidos, e plataformas de prompt management (LangSmith, PromptLayer, Langfuse). Também cobrimos A/B testing de prompts: como medir se a versão B é realmente melhor do que a A em métricas de negócio.",
            type: "tool",
            status: "coming-soon",
            tags: ["Prompt Management", "LangSmith", "Versionamento", "Testes", "A/B Testing", "Jinja2"],
          },
        ],
      },
      {
        number: "03",
        title: "RAG: Retrieval-Augmented Generation",
        nodes: [
          {
            id: 11,
            label: "Bancos de Dados Vetoriais",
            description:
              "Vector databases são a infraestrutura do RAG — e escolher o errado impacta latência, custo e escalabilidade. Você aprende os quatro principais: Pinecone (managed, sem operação, mas caro), Qdrant (open-source, melhor performance por dólar, suporte a filtros complexos), Chroma (simples para prototipagem), e pgvector (extensão do PostgreSQL, ideal quando você já tem Postgres e quer evitar nova infra). Benchmarks comparativos de latência e recall@10 para datasets de 1M, 10M e 100M vetores.",
            type: "tool",
            status: "coming-soon",
            tags: ["Pinecone", "Qdrant", "Chroma", "pgvector", "Vector DB", "HNSW"],
          },
          {
            id: 12,
            label: "Estratégias de Chunking de Documentos",
            description:
              "A qualidade do RAG depende mais do chunking do que do modelo — documentos mal divididos geram respostas incompletas ou fora de contexto. Você aprende chunking por tamanho fixo (simples mas quebra contexto), por separador semântico (parágrafos, seções), com overlap para não perder informação nas bordas, e chunking semântico que usa embeddings para detectar mudanças de tópico. Parent-child chunking: chunks pequenos para busca precisa, chunks grandes para contexto completo na geração. Projeto: compare recall de 5 estratégias no mesmo dataset.",
            type: "concept",
            status: "coming-soon",
            tags: ["Chunking", "Overlap", "Semântico", "Parent-Child", "Documentos", "RAG"],
          },
          {
            id: 13,
            label: "RAG Básico: Pipeline Completo",
            description:
              "O pipeline fundamental de RAG: ingestão de documentos (PDF, Word, HTML, Markdown, tabelas), parsing (extração de texto preservando estrutura), chunking, embedding e indexação no vector store, e a busca+geração em tempo de query. Você constrói do zero com LangChain e com código puro (sem framework) para entender cada etapa. Fontes de dados cobertos: PDFs com PyMuPDF/pdfplumber, páginas web com Trafilatura, bancos de dados via SQL, e APIs externas. Qualidade medida com RAGAS desde o início.",
            type: "concept",
            status: "coming-soon",
            tags: ["RAG", "LangChain", "Ingestão", "Pipeline", "PDF", "RAGAS"],
          },
          {
            id: 14,
            label: "RAG Avançado: HyDE, Reranking & Multi-Query",
            description:
              "RAG básico recupera os chunks mais similares à query — mas a query do usuário raramente é o melhor vetor de busca. HyDE (Hypothetical Document Embeddings) faz o LLM gerar uma resposta hipotética e usa seu embedding para buscar, melhorando recall em 20-40%. Multi-query expande a query original em variações para cobrir mais ângulos. Reranking com Cohere Rerank ou cross-encoders reordena os resultados por relevância real após a busca vetorial. Self-RAG decide adaptativamente quando buscar e como criticar os resultados.",
            type: "concept",
            status: "coming-soon",
            tags: ["HyDE", "Reranking", "Multi-Query", "Cohere", "Self-RAG", "RAG Avançado"],
          },
          {
            id: 15,
            label: "Avaliação de RAG com RAGAS",
            description:
              "RAG sem avaliação sistemática é tentativa e erro. RAGAS (RAG Assessment) mede 4 dimensões: faithfulness (o LLM inventou algo não presente nos chunks?), answer relevancy (a resposta é relevante para a query?), context precision (os chunks recuperados são realmente úteis?), e context recall (todos os chunks necessários foram recuperados?). Você monta um testset de 100 perguntas com ground truth, automatiza a avaliação via LLM-as-judge, e usa os resultados para iterar nas estratégias de chunking e retrieval.",
            type: "tool",
            status: "coming-soon",
            tags: ["RAGAS", "Avaliação", "LLM-as-Judge", "Faithfulness", "Relevância", "Testset"],
          },
          {
            id: 16,
            label: "LlamaIndex: Índices Especializados",
            description:
              "LlamaIndex vai além de RAG simples com índices especializados para diferentes tipos de dados. Summary Index para sumarização de documentos longos. Knowledge Graph Index para dados relacionais onde conexões importam. SQL Query Engine para responder perguntas em linguagem natural sobre bancos de dados relacionais. Agentes com acesso a múltiplas fontes de conhecimento. RouterQueryEngine para decidir automaticamente qual índice consultar. Quando comparado ao LangChain, LlamaIndex se destaca em pipelines de recuperação complexos e dados estruturados.",
            type: "tool",
            status: "coming-soon",
            tags: ["LlamaIndex", "Knowledge Graph", "SQL Query Engine", "Router", "Índices"],
          },
        ],
      },
      {
        number: "04",
        title: "Agentes & Ferramentas",
        nodes: [
          {
            id: 17,
            label: "Tool Use & Function Calling",
            description:
              "Function calling é o que transforma um LLM em um agente capaz de agir no mundo — o modelo decide qual ferramenta chamar, com quais argumentos, e como usar o resultado. Você aprende o schema de tools no formato OpenAI (name, description, parameters em JSON Schema), como escrever descriptions de tools que guiam o modelo a usar a ferramenta correta, parallel tool calling para múltiplas ações simultâneas, e como construir ferramentas customizadas: busca na web, consulta a banco de dados, envio de email, chamada de API interna.",
            type: "concept",
            status: "coming-soon",
            tags: ["Function Calling", "Tool Use", "JSON Schema", "Tools", "Agentes"],
          },
          {
            id: 18,
            label: "Framework ReAct e Loop Agente",
            description:
              "ReAct (Reasoning + Acting) é o padrão fundamental de agentes: o modelo alterna entre raciocínio (Thought) e ação (Action/Observation) até chegar na resposta final. Você implementa o loop do zero — sem framework — para entender exatamente o que acontece: a cada iteração o modelo recebe o histórico de pensamentos e observações, decide a próxima ação, você executa a ferramenta e injeta o resultado, e repete. Depois de implementar manualmente, o mesmo pattern é construído com LangChain AgentExecutor e com LlamaIndex ReActAgent.",
            type: "concept",
            status: "coming-soon",
            tags: ["ReAct", "Agentes", "Loop", "LangChain", "Pensamento", "Ação"],
          },
          {
            id: 19,
            label: "Memória em Agentes",
            description:
              "Agentes sem memória esquecem tudo entre sessões — e agentes com memória mal implementada ficam lentos e caros quando o histórico cresce. Você aprende as 4 formas de memória: in-context (conversa completa, simples mas limitado pelo context window), summarization (resumo progressivo da conversa), entity memory (extrai e mantém fatos sobre entidades mencionadas), e memória vetorial (recupera apenas as partes relevantes do histórico por similaridade semântica). Cada padrão é implementado e benchmarkado em custo × precisão.",
            type: "concept",
            status: "coming-soon",
            tags: ["Memória", "Agentes", "Summarization", "Entity Memory", "Vetorial", "Context"],
          },
          {
            id: 20,
            label: "Multi-Agentes: CrewAI & AutoGen",
            description:
              "Alguns problemas são complexos demais para um único agente — sistemas multi-agente dividem o trabalho entre especialistas. CrewAI permite definir crews (equipes) com agentes especializados (pesquisador, escritor, crítico) que colaboram em uma tarefa, com memória compartilhada e handoff estruturado. AutoGen da Microsoft usa conversas entre agentes para auto-correção iterativa. Você constrói um pipeline de geração de relatórios de pesquisa onde um agente busca, outro analisa e um terceiro formata — com revisão automática antes de entregar.",
            type: "tool",
            status: "coming-soon",
            tags: ["CrewAI", "AutoGen", "Multi-Agente", "Equipes", "Colaboração"],
          },
          {
            id: 21,
            label: "Agentes com Acesso à Web & Computador",
            description:
              "Agentes com ferramentas de busca na web podem responder sobre eventos recentes sem fine-tuning. Tavily Search é a API de busca otimizada para LLMs (retorna snippets estruturados, não HTML). SerpAPI para resultados Google. Você constrói um agente de pesquisa que busca, lê páginas, extrai informações relevantes e sintetiza. Para casos avançados: Computer Use (Anthropic Claude) que opera a interface gráfica de um computador, e Browser-Use/Playwright para automação de browser controlada por LLM.",
            type: "tool",
            status: "coming-soon",
            tags: ["Tavily", "SerpAPI", "Computer Use", "Browser-Use", "Web", "Pesquisa"],
          },
        ],
      },
      {
        number: "05",
        title: "Fine-tuning & Modelos Próprios",
        nodes: [
          {
            id: 22,
            label: "Quando Fine-tunar vs. RAG vs. Prompting",
            description:
              "Esta é a decisão mais importante antes de começar qualquer projeto de LLM — e a maioria dos engenheiros erra por tentar fine-tuning quando prompting seria suficiente. Framework de decisão: prompting primeiro (mais rápido, sem dado de treino, fácil de iterar), RAG quando o modelo precisa de conhecimento externo atualizado, fine-tuning quando você precisa de estilo consistente, comportamento especializado em domínio, ou redução de custo via modelo menor. Casos reais de cada escolha com análise de custo-benefício.",
            type: "concept",
            status: "coming-soon",
            tags: ["Fine-tuning", "RAG", "Prompt Engineering", "Decisão", "Trade-offs"],
          },
          {
            id: 23,
            label: "Curadoria de Datasets para Fine-tuning",
            description:
              "A qualidade do dataset determina a qualidade do fine-tuning — dados ruins produzem modelos ruins, mesmo com a melhor técnica. Você aprende a formatar dados no padrão de chat (system/user/assistant), coletar exemplos de alta qualidade (curadoria manual vs. destilação de GPT-4), técnicas de data augmentation para texto (parafrasear, variar formato), detecção e remoção de duplicatas e exemplos de baixa qualidade, e o mínimo de exemplos necessários para diferentes objetivos (100 para formato, 1000+ para conhecimento). Ferramenta: Argilla para anotação colaborativa.",
            type: "concept",
            status: "coming-soon",
            tags: ["Dataset", "Curadoria", "Instruct", "Argilla", "Qualidade", "Destilação"],
          },
          {
            id: 24,
            label: "LoRA & QLoRA: Fine-tuning Eficiente",
            description:
              "Fine-tuning completo de um modelo de 7B parâmetros exige 14 GPUs A100 — inviável para a maioria. LoRA (Low-Rank Adaptation) resolve isso congelando o modelo base e treinando apenas matrizes de baixo rank injetadas nas camadas de atenção, reduzindo parâmetros treináveis de 7B para ~4M. QLoRA adiciona quantização 4-bit do modelo base, permitindo fine-tuning de modelos de 13B em uma única GPU A10G. Você aprende rank, alpha, target modules (q_proj, v_proj, etc.), e como mesclar os adaptadores no modelo base para deploy.",
            type: "tool",
            status: "coming-soon",
            tags: ["LoRA", "QLoRA", "PEFT", "Fine-tuning", "Adaptadores", "Eficiência"],
          },
          {
            id: 25,
            label: "Treinamento com Unsloth & Axolotl",
            description:
              "Unsloth reimplementou os kernels de atenção e backpropagation do zero, entregando 2x mais velocidade de treinamento e 50% menos memória comparado ao HuggingFace vanilla — com a mesma acurácia. Ideal para fine-tuning rápido no Colab ou em GPUs menores. Axolotl é a alternativa mais flexível para configurações avançadas: múltiplos formatos de dataset, DPO, reward modeling, multipack para eficiência com sequências de tamanhos variados. Você treina um modelo assistente especializado em um domínio técnico e compara os resultados com o modelo base.",
            type: "tool",
            status: "coming-soon",
            tags: ["Unsloth", "Axolotl", "Treinamento", "Velocidade", "Colab", "DPO"],
          },
          {
            id: 26,
            label: "DPO & Alinhamento: RLHF Simplificado",
            description:
              "RLHF (Reinforcement Learning from Human Feedback) é como os LLMs são alinhados para ser úteis e seguros — mas é complexo e caro. DPO (Direct Preference Optimization) simplifica: dado pares de respostas (preferida vs. rejeitada), treina o modelo diretamente sem precisar de um reward model separado. Você aprende a coletar dados de preferência, formatar no padrão DPO, treinar com TRL (Transformer Reinforcement Learning library), e avaliar com win-rate contra o modelo base usando GPT-4 como juiz. SimPO é coberto como alternativa mais recente e eficiente.",
            type: "concept",
            status: "coming-soon",
            tags: ["DPO", "RLHF", "TRL", "Alinhamento", "Preferência", "SimPO"],
          },
        ],
      },
      {
        number: "06",
        title: "Deploy & Produção de LLMs",
        nodes: [
          {
            id: 27,
            label: "Serving Local: vLLM, Ollama & llama.cpp",
            description:
              "Nem tudo precisa (ou deve) ir para a API da OpenAI — dados sensíveis, requisitos de latência extrema, ou orçamento limitado justificam self-hosting. vLLM é o servidor de inferência de maior throughput para GPUs: PagedAttention permite servir 10x mais requisições simultâneas que a inferência vanilla, com OpenAI-compatible API. Ollama simplifica o setup local de modelos quantizados para desenvolvimento e testes. llama.cpp roda modelos GGUF quantizados em CPU (e GPU via Metal/CUDA), viável para modelos de 7B em máquinas sem GPU dedicada.",
            type: "tool",
            status: "coming-soon",
            tags: ["vLLM", "Ollama", "llama.cpp", "Self-Hosting", "PagedAttention", "GGUF"],
          },
          {
            id: 28,
            label: "Deploy em Cloud: Bedrock, Azure OpenAI & Vertex",
            description:
              "Para produção empresarial, plataformas gerenciadas eliminam a operação de infraestrutura. AWS Bedrock oferece acesso a Claude, Llama, e Mistral via API unificada com compliance, private links, e sem dados usados para treinamento. Azure OpenAI Service hospeda modelos GPT em sua infra com SLAs empresariais e integração com Azure AD. GCP Vertex AI oferece Gemini e modelos de terceiros via Model Garden. Você aprende a avaliar trade-offs: custo, latência, compliance, personalização, e vendor lock-in.",
            type: "tool",
            status: "coming-soon",
            tags: ["AWS Bedrock", "Azure OpenAI", "Vertex AI", "Enterprise", "Compliance", "SLA"],
          },
          {
            id: 29,
            label: "Observabilidade: Langfuse & LangSmith",
            description:
              "Sistemas de LLM em produção são difíceis de debugar sem rastreamento — um output incorreto pode vir de um prompt ruim, retrieval inadequado, ou comportamento emergente do modelo. Langfuse (open-source) rastreia cada chamada com traces hierárquicos: você vê exatamente quais chunks foram recuperados, qual prompt foi enviado, qual resposta voltou, em quanto tempo, a que custo. LangSmith (da LangChain) integra nativo com o framework. Avaliação contínua: adicionar evaluators que rodam em background e alertam quando qualidade degrada.",
            type: "tool",
            status: "coming-soon",
            tags: ["Langfuse", "LangSmith", "Observabilidade", "Traces", "Custo", "Qualidade"],
          },
          {
            id: 30,
            label: "Otimização de Latência & Custo em Produção",
            description:
              "LLMs são caros — sem otimização, projetos promissores morrem por custo. Caching de respostas idênticas (semantic caching com GPTCache detecta queries similares, não apenas iguais). Roteamento de modelos: queries simples para modelos baratos (GPT-4o-mini, Haiku), queries complexas para modelos poderosos — redução de 60-80% em custo. Streaming para percepção de latência reduzida. Speculative decoding para throughput maior. Prompt compression com LLMLingua reduz tokens sem perder informação essencial.",
            type: "concept",
            status: "coming-soon",
            tags: ["Caching", "Roteamento", "LLMLingua", "Custo", "Latência", "Otimização"],
          },
          {
            id: 31,
            label: "Segurança, Moderação & Compliance",
            description:
              "Sistemas de LLM em produção precisam de múltiplas camadas de proteção. Llama Guard classifica inputs e outputs em categorias de risco (violência, sexualidade, fraude) com um modelo pequeno e rápido. OpenAI Moderation API é alternativa gerenciada. Para compliance empresarial: LGPD e GDPR impõem restrições sobre processar dados pessoais com LLMs de terceiros (use anonimização antes de enviar ou self-host). Data minimization: não envie dados que não são necessários para a tarefa. Auditoria: log de todas as interações com hash de conteúdo para não-repúdio.",
            type: "concept",
            status: "coming-soon",
            tags: ["Llama Guard", "Moderação", "LGPD", "GDPR", "Compliance", "Anonimização"],
          },
        ],
      },
      {
        number: "07",
        title: "Projetos Finais",
        nodes: [
          {
            id: 32,
            label: "Chatbot com RAG sobre Base de Conhecimento",
            description:
              "Um assistente empresarial completo que responde perguntas sobre documentos internos: ingestão de PDFs e páginas web com chunking semântico, embeddings com text-embedding-3-large, índice no Qdrant com filtros por metadados (data, categoria, autor), RAG com reranking, memória de conversa, e interface em Streamlit com fontes citadas em cada resposta. Pipeline de avaliação com RAGAS metrifica faithfulness e relevância continuamente. Deploy no Cloud Run com autenticação. Link público com dados reais no portfólio.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "RAG", "Qdrant", "Streamlit", "RAGAS", "Cloud Run"],
          },
          {
            id: 33,
            label: "Agente Autônomo de Pesquisa & Análise",
            description:
              "Um agente de IA que recebe uma pergunta complexa de negócio, quebra em sub-tarefas, busca na web com Tavily, lê e extrai informações de páginas relevantes, consulta uma base interna via RAG, executa código Python para análise quantitativa, e produz um relatório estruturado com fontes. Implementado com CrewAI (pesquisador → analista → escritor), monitorado via Langfuse para debug de cada passo. O projeto demonstra orquestração de múltiplos agentes em uma tarefa de pesquisa real.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Agentes", "CrewAI", "Tavily", "Langfuse", "Pesquisa"],
          },
          {
            id: 34,
            label: "Fine-tuning e Deploy de Modelo Especialista",
            description:
              "Você fine-tuna um modelo Llama 3.1 8B ou Mistral 7B para uma tarefa especializada em português — análise jurídica, suporte técnico, ou geração de código — usando QLoRA com Unsloth, DPO para alinhamento de preferências, e avaliação rigorosa com LLM-as-judge comparando contra GPT-4o. O modelo é quantizado em GGUF, servido via vLLM com API compatível com OpenAI, deployado no Kubernetes com auto-scaling, e monitorado com Langfuse. Resultado: modelo menor, mais barato, mais rápido e melhor que GPT-4 na tarefa específica.",
            type: "project",
            status: "coming-soon",
            tags: ["Portfólio", "Fine-tuning", "QLoRA", "vLLM", "Kubernetes", "Llama 3"],
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
