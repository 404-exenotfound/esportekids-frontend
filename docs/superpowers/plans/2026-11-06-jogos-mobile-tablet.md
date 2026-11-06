# Jogos no Celular e Tablet — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Os 5 minigames (pênalti, basquete, ping-pong, boliche, salto) ficam jogáveis no celular (sempre deitado) e no tablet (livre, bem aproveitado em pé e deitado), sem mudar nada no desktop.

**Architecture:** Um hook `useDispositivo` classifica o aparelho (celular/tablet/desktop) e a orientação. Cada jogo coloca classes `is-*` no wrapper e classes genéricas `jogo-*` nos elementos que já existem; um único CSS compartilhado (`jogo-dispositivo.css`) faz o layout compacto. No celular em pé aparece o overlay `AvisoGirarCelular`, que também pausa o jogo. No Android, clicar em "Jogar" entra em tela cheia e trava a orientação na horizontal.

**Tech Stack:** React 19, Vite 8, CSS puro (sem Bootstrap nos jogos), Vitest (novo, só para a função pura de classificação).

**Spec:** decidido na conversa de 2026-11-06 (sem documento separado):
- Celular → jogo sempre na horizontal. Android: tela cheia + `screen.orientation.lock("landscape")` ao clicar em Jogar. iPhone ou falha no lock: overlay "Gire o celular" com o celular em pé (opção 1; **nada de girar via CSS rotate**).
- Tablet → sem forçar orientação; deitado ≈ desktop; em pé, jogo na largura toda e controles maiores embaixo.
- Desktop → sem nenhuma mudança visual ou de comportamento.

## Global Constraints

- Celular = `(pointer: coarse)` E `Math.min(screen.width, screen.height) < 600`.
- Tablet = `(pointer: coarse)` E `Math.min(screen.width, screen.height) >= 600`.
- Desktop = qualquer outro caso (inclui notebook com touch e mouse, porque o `pointer` primário é `fine`).
- Altura de tela no mobile: usar `100dvh` (com `100vh` antes como fallback), nunca só `100vh`.
- Área mínima de toque nos botões do tablet/celular: 48×48px.
- Respeitar o notch: `padding` com `env(safe-area-inset-left/right)` no palco do celular deitado.
- Textos novos em PT-BR, fonte "Press Start 2P", paleta dos jogos (`#e63946`, `#1f1f1f`, `#ffd166`, `#f5f5dc`).
- **Não alterar** a lógica dos jogos (física, pontuação, dicas, quiz); o único ponto de contato no loop é o `pausado`.
- Estilo de código: igual ao existente (componentes `.jsx` com comentários curtos em PT-BR, sem ponto e vírgula opcional removido, hooks `use*` com export default).

## Review Focus

1. **Girar no meio da partida (celular):** com o ping-pong correndo, girar para retrato tem que congelar a bola e o tempo; ao voltar para paisagem, o jogo continua de onde parou, sem salto de física. → teste manual na Task 3, passo 5.
2. **Fim de jogo com o celular em pé:** o quiz e a tela final (`FimEducativo`) ficam **fora** do palco e podem ser lidos em pé, então o overlay "Gire" **não** pode aparecer quando o palco está oculto (`terminou`). → Task 2, passo 3 (`ativo={!terminou}`).
3. **Lock de orientação rejeitado** (Chrome desktop no modo dispositivo, Samsung Internet, Firefox): a promise rejeitada não pode gerar erro no console nem quebrar a tela cheia. → Task 4, passo 2.
4. **Teclado virtual / barra do navegador do iOS** mudando a altura: o palco recalcula sozinho (o `EscalaProporcional` já usa `ResizeObserver`), e nada pode ficar cortado embaixo. → Task 5, passo 4 (checar no Safari iOS de verdade ou com o "Responsive Design Mode" do Safari).
5. **Notebook com tela touch** não pode ser tratado como tablet. → teste unitário `desktop com touch secundário` na Task 1.

---

## Estrutura de arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/hooks/classificarDispositivo.js` | Criar | Função pura: `(toque, largura, altura, larguraJanela, alturaJanela) → { tipo, retrato }` |
| `src/hooks/classificarDispositivo.test.js` | Criar | Testes Vitest da função acima |
| `src/hooks/useDispositivo.js` | Criar | Hook que lê `matchMedia`/`screen`/`window` e reage a resize e orientationchange |
| `src/components/AvisoGirarCelular.jsx` | Criar | Overlay fixo "Gire o celular" |
| `src/styles/jogo-dispositivo.css` | Criar | Regras de layout celular/tablet compartilhadas pelos 5 jogos + estilo do aviso |
| `src/hooks/useTelaCheia.js` | Modificar | Lock/unlock de orientação; expor `entrarTelaCheia` |
| `src/components/BotaoTelaCheia.jsx` | Modificar | Adicionar a classe genérica `jogo-tela-cheia` |
| `src/pages/{futebol,basquete,Boliche}/index.jsx` | Modificar | Classes, overlay, `pausado` no loop, tela cheia automática no celular |
| `src/pages/{pingpong,atletismo}/index.jsx` + `hooks/use*.js` | Modificar | Idem, com `pausado` passado para o hook |
| `src/pages/*/styles/index.css` | Modificar | `100vh` → `100dvh` no bloco `:fullscreen`; Boliche: corrigir seletor `.bol-palco` → `.bol-stage` |
| `package.json` | Modificar | `vitest` em devDependencies + script `"test": "vitest run"` |

---

### Task 1: Classificação do aparelho (`classificarDispositivo` + `useDispositivo`)

**Files:**
- Create: `src/hooks/classificarDispositivo.js`
- Create: `src/hooks/classificarDispositivo.test.js`
- Create: `src/hooks/useDispositivo.js`
- Modify: `package.json`

**Interfaces:**
- Produces:
  - `classificarDispositivo({ toque: boolean, larguraTela: number, alturaTela: number, larguraJanela: number, alturaJanela: number }) → { tipo: "celular" | "tablet" | "desktop", retrato: boolean }` (export nomeado)
  - `useDispositivo() → { tipo, retrato, ehCelular: boolean, ehTablet: boolean, classes: string }` (export default). `classes` é `""` no desktop; senão `"is-celular is-retrato"`, `"is-tablet is-paisagem"` etc.

- [ ] **Step 1: Instalar o Vitest**

Run: `npm i -D vitest` e adicionar `"test": "vitest run"` em `scripts`.
Expected: `npx vitest --version` imprime a versão sem erro de peer dependency com o Vite 8. Se der conflito, usar a versão do Vitest que declara suporte ao Vite 8 no `peerDependencies`.

- [ ] **Step 2: Escrever os testes que falham**

```js
import { describe, it, expect } from "vitest"
import { classificarDispositivo as c } from "./classificarDispositivo"

describe("classificarDispositivo", () => {
  it("iPhone em pé", () => {
    expect(c({ toque: true, larguraTela: 390, alturaTela: 844, larguraJanela: 390, alturaJanela: 664 }))
      .toEqual({ tipo: "celular", retrato: true })
  })
  it("celular Android deitado", () => {
    expect(c({ toque: true, larguraTela: 915, alturaTela: 412, larguraJanela: 915, alturaJanela: 360 }))
      .toEqual({ tipo: "celular", retrato: false })
  })
  it("iPad em pé", () => {
    expect(c({ toque: true, larguraTela: 768, alturaTela: 1024, larguraJanela: 768, alturaJanela: 954 }))
      .toEqual({ tipo: "tablet", retrato: true })
  })
  it("iPad Pro deitado", () => {
    expect(c({ toque: true, larguraTela: 1366, alturaTela: 1024, larguraJanela: 1366, alturaJanela: 954 }))
      .toEqual({ tipo: "tablet", retrato: false })
  })
  it("desktop com touch secundário", () => {
    expect(c({ toque: false, larguraTela: 1920, alturaTela: 1080, larguraJanela: 1920, alturaJanela: 960 }).tipo)
      .toBe("desktop")
  })
  it("desktop com janela estreita continua desktop", () => {
    expect(c({ toque: false, larguraTela: 1920, alturaTela: 1080, larguraJanela: 400, alturaJanela: 900 }).tipo)
      .toBe("desktop")
  })
})
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (`classificarDispositivo` não existe).

- [ ] **Step 4: Implementar `classificarDispositivo`**

O lado menor da **tela** (`screen`) decide celular/tablet (não muda ao girar); a **janela** decide `retrato` (`alturaJanela > larguraJanela`). Sem toque → `"desktop"`. Corte em 600 (Global Constraints).

- [ ] **Step 5: Rodar e ver passar**

Run: `npm test`
Expected: 6 testes passando.

- [ ] **Step 6: Implementar `useDispositivo`**

Lê `window.matchMedia("(pointer: coarse)").matches`, `screen.width/height` e `window.innerWidth/innerHeight`; recalcula em `resize`, `orientationchange` e no `change` do `matchMedia`; guarda em `useState` e só atualiza se `tipo` ou `retrato` mudarem.

- [ ] **Step 7: Lint e commit**

Run: `npm run lint` → sem erros novos.
```bash
git add package.json package-lock.json src/hooks/classificarDispositivo.js src/hooks/classificarDispositivo.test.js src/hooks/useDispositivo.js
git commit -m "feat: hook useDispositivo para detectar celular/tablet e orientação"
```

---

### Task 2: Overlay "Gire o celular" + CSS compartilhado + piloto no Pênalti

Fazer tudo em um jogo (futebol) primeiro para validar a abordagem antes de replicar.

**Files:**
- Create: `src/components/AvisoGirarCelular.jsx`
- Create: `src/styles/jogo-dispositivo.css`
- Modify: `src/components/BotaoTelaCheia.jsx`
- Modify: `src/pages/futebol/index.jsx` (wrapper ~L900, título ~L905, palco ~L925, loop ~L839-865, rodapé ~L996)

**Interfaces:**
- Consumes: `useDispositivo()` (Task 1)
- Produces:
  - `<AvisoGirarCelular ativo={boolean} />`: renderiza só se `ativo && ehCelular && retrato`. Ele mesmo chama `useDispositivo`.
  - Classes genéricas que todo jogo deve receber, **somadas** às atuais: `jogo-wrapper` (+ `classes` do hook), `jogo-titulo-barra`, `jogo-stage`, `jogo-rodape`, `jogo-tela-cheia` (aplicada pelo `BotaoTelaCheia`).
  - Padrão de pausa: `const pausado = ehCelular && retrato && !terminou`, guardado em `pausadoRef`; no loop, se `pausadoRef.current` for true, pula `atualizar(...)`, zera o acumulador (`acc = 0`) e continua desenhando.

- [ ] **Step 1: `AvisoGirarCelular.jsx`**

`div.jogo-aviso-girar` com `role="alert"`, ícone 📱 com animação de rotação de 90° e o texto exato: **"GIRE O CELULAR PARA JOGAR"** e, embaixo, menor: **"O jogo funciona deitado"**.

- [ ] **Step 2: `jogo-dispositivo.css`**

Importado pelo `AvisoGirarCelular.jsx`. Regras:
- `.jogo-aviso-girar`: `position: fixed; inset: 0; z-index: 2000;` fundo `#1f1f1f` com 95% de opacidade, texto `#ffd166` centralizado, fonte Press Start 2P. Fica acima do VOLTAR (1060) e do TELA CHEIA (1070), mas o VOLTAR deve continuar clicável: o aviso desenha um botão "⬅ VOLTAR" próprio que navega para `/home`.
- `.is-celular.is-paisagem`: esconde `.jogo-titulo-barra`; `.jogo-wrapper` com `height: 100vh; height: 100dvh`; `.jogo-stage` com `margin: 0; border-width: 3px; box-shadow: none; max-width: 100%` e padding de safe-area; `.jogo-rodape` vira uma faixa de 1 linha com fonte de 8px (ou some se não couber; a dica já aparece no `DicaToast`); `.edu-voltar` e `.jogo-tela-cheia` com `padding: 6px 8px; font-size: 8px; top: 4px`.
- `.is-tablet.is-retrato`: `.jogo-stage` com `max-width: calc(100% - 24px)` (largura total); `.jogo-rodape-texto` com fonte maior (12px); botões dentro de `.jogo-wrapper` com `min-height: 48px`.
- `.is-tablet.is-paisagem`: só garantir `100dvh` e o mínimo de 48px nos botões.
- Nada fora de `.is-celular`/`.is-tablet` (o desktop não pode mudar).

- [ ] **Step 3: Aplicar no futebol**

`const { classes, ehCelular, retrato } = useDispositivo()`; somar as classes genéricas; renderizar `<AvisoGirarCelular ativo={!mostrarFim} />` como primeiro filho do `.pc-wrapper`; criar `pausadoRef` e usá-lo no loop (ver Interfaces). No `BotaoTelaCheia`, montar `className={`${classe} jogo-tela-cheia`}`.

- [ ] **Step 4: Rodar e conferir no DevTools**

Run: `npm run dev` e abrir `/futebol` no Chrome DevTools → Device Toolbar.
Expected:
- iPhone 12 Pro em pé → aviso "GIRE O CELULAR" cobre tudo; o botão VOLTAR do aviso leva para `/home`.
- Girar (botão ⟳ do DevTools) → aviso some, sem título, jogo com a altura toda, chutes funcionam com toque.
- iPad Mini em pé → sem aviso, jogo na largura toda, texto do rodapé maior.
- Desktop (Device Toolbar desligado) → **idêntico** ao `master` (comparar com print antes da mudança).

- [ ] **Step 5: Teste de pausa**

No iPhone deitado, comece a cobrança, gire para retrato no meio do chute, espere 5s e gire de volta.
Expected: a bola continua de onde parou.

- [ ] **Step 6: Commit**

```bash
git add src/components/AvisoGirarCelular.jsx src/styles/jogo-dispositivo.css src/components/BotaoTelaCheia.jsx src/pages/futebol/index.jsx
git commit -m "feat: layout mobile/tablet e aviso de girar celular no pênalti"
```

---

### Task 3: Replicar nos outros 4 jogos

**Files:**
- Modify: `src/pages/basquete/index.jsx` (wrapper ~L883, título ~L889, palco ~L912, loop ~L805-828, rodapé ~L974)
- Modify: `src/pages/Boliche/index.jsx` (wrapper ~L821, título ~L826, palco ~L844, loop ~L762-783 — aqui pausar = não chamar `atualizar` **nem** `atualizarVizinha`, rodapé ~L908)
- Modify: `src/pages/pingpong/index.jsx` (L27/32/56/102) + `src/pages/pingpong/hooks/usePingpong.js` (assinatura L697, loop `step` até ~L1091)
- Modify: `src/pages/atletismo/index.jsx` (L34/40/63/109) + `src/pages/atletismo/hooks/useAtletismo.js` (assinatura L36, loop `step` até ~L347)

**Interfaces:**
- Consumes: tudo o que a Task 2 produz.
- Produces: `usePingpong({ pausado = false } = {})` e `useAtletismo({ pausado = false } = {})`. Dentro de cada um, um `pausadoRef` sincronizado; no `step`, quando pausado, atualizar o timestamp anterior (`last` / `lastTimeRef`) para `agora`, pular a simulação e só desenhar, para não acontecer um salto de `dt` ao voltar.

Atenção: nos hooks, `terminou` vem do próprio hook, então calcular `pausado = ehCelular && retrato` na página e deixar o hook ignorar quando já estiver no fim.

- [ ] **Step 1: Basquete**: mesmo padrão da Task 2, passo 3.
- [ ] **Step 2: Boliche**: idem. O arremesso por toque já existe (`onPointerDown={acao}` no canvas), então não precisa de botão novo.
- [ ] **Step 3: Ping-pong**: classes + aviso na página; `pausado` passado para `usePingpong`.
- [ ] **Step 4: Salto em distância**: classes + aviso na página; `pausado` passado para `useAtletismo`. Conferir que o `BotaoAcao` (`.atl-acao-wrap`) fica acessível no celular deitado e tem pelo menos 48px.
- [ ] **Step 5: Verificar os 4 jogos** com o mesmo roteiro da Task 2, passos 4 e 5. No ping-pong, girar no meio do rali: a bola tem que congelar e voltar sem teletransportar.
- [ ] **Step 6: Lint e commit**

Run: `npm run lint` → sem erros novos.
```bash
git add src/pages/basquete src/pages/Boliche src/pages/pingpong src/pages/atletismo
git commit -m "feat: layout mobile/tablet e aviso de girar nos demais minigames"
```

---

### Task 4: Tela cheia + trava horizontal no Android

**Files:**
- Modify: `src/hooks/useTelaCheia.js`
- Modify: os 5 `index.jsx` (onde está `iniciar` / `onJogar`)

**Interfaces:**
- Consumes: `useDispositivo` (Task 1).
- Produces: `useTelaCheia` passa a retornar também `entrarTelaCheia` (o `entrar` que já existe). Assinatura inalterada: `useTelaCheia(terminou)`.

- [ ] **Step 1: Lock ao entrar**

Em `entrar`: encadear no resultado de `requestFullscreen()` (é uma promise; no webkit pode retornar `undefined`, então usar `Promise.resolve(...)`) a chamada `screen.orientation?.lock?.("landscape")`, só quando `useDispositivo().ehCelular`.

- [ ] **Step 2: Engolir rejeições**

Toda promise de `requestFullscreen` e `lock` com `.catch(() => {})`: navegadores sem suporte rejeitam, e o aviso "Gire" já cobre esse caso.

- [ ] **Step 3: Unlock ao sair**

No listener de `fullscreenchange`, quando sair da tela cheia, chamar `screen.orientation?.unlock?.()` dentro de try/catch.

- [ ] **Step 4: Tela cheia automática ao clicar em Jogar (só celular)**

Nos 5 jogos, embrulhar o handler do botão Jogar da intro: `if (ehCelular && suportaTelaCheia) entrarTelaCheia()`, depois o `iniciar`/`startGame`/`iniciarJogo` original. Tem que ser chamado **dentro do clique** (gesto do usuário), não num `useEffect`. Em "Jogar novamente" também.

- [ ] **Step 5: Verificar num Android real** (o DevTools não simula lock)

Run: `npm run dev -- --host` e abrir o IP da máquina no Chrome do celular Android, em pé.
Expected: clicar em Jogar → tela cheia e o jogo vira deitado sozinho; no fim do jogo sai da tela cheia, destrava, e o quiz pode ser lido em pé. No iPhone: sem tela cheia, o aviso "Gire" aparece até a pessoa girar.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useTelaCheia.js src/pages/*/index.jsx
git commit -m "feat: tela cheia e trava horizontal ao jogar no celular Android"
```

---

### Task 5: CSS de tela cheia (`100dvh`) + seletor quebrado do Boliche

**Files:**
- Modify: `src/pages/futebol/styles/index.css:449-460`
- Modify: `src/pages/basquete/styles/index.css:434-446`
- Modify: `src/pages/pingpong/styles/index.css:452-464`
- Modify: `src/pages/atletismo/styles/index.css:412-424`
- Modify: `src/pages/Boliche/styles/index.css:387-428`

- [ ] **Step 1:** Em cada bloco `:fullscreen` / `:-webkit-full-screen`, depois de cada `height: 100vh` / `max-height: 100vh`, adicionar a mesma linha com `100dvh` (o `vh` fica como fallback).
- [ ] **Step 2:** No Boliche, os seletores usam `.bol-palco`, mas o elemento é `.bol-stage` (index.jsx L844), então hoje a tela cheia do boliche não pega esse CSS. Trocar `.bol-palco` por `.bol-stage` nos seletores de fullscreen.
- [ ] **Step 3:** Desktop: abrir o Boliche, apertar F e conferir que agora fica com fundo preto e o botão SAIR DA TELA CHEIA no canto inferior direito, igual aos outros jogos.
- [ ] **Step 4:** Celular Android em tela cheia: nada cortado embaixo. Safari iOS (Responsive Design Mode ou aparelho): com a barra do navegador aparecendo/sumindo, o palco se ajusta.
- [ ] **Step 5: Commit**

```bash
git add src/pages/*/styles/index.css
git commit -m "fix: tela cheia usa dvh no mobile e corrige seletor do boliche"
```

---

### Task 6: Passada final

- [ ] **Step 1:** `npm test && npm run lint && npm run build`, tudo verde.
- [ ] **Step 2:** Matriz manual (DevTools) nos 5 jogos: iPhone SE (375×667), iPhone 14 Pro Max (430×932), Galaxy S20 (360×800), iPad Mini (768×1024), iPad Pro 12.9 (1024×1366), cada um em pé e deitado, e desktop 1920×1080. Anotar qualquer coisa cortada ou sobreposta.
- [ ] **Step 3:** Corrigir o que aparecer no `jogo-dispositivo.css` (preferir ajuste compartilhado a regra por jogo) e commitar.
