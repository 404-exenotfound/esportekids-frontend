// ============================================================================
// criarRuidoBuffer — ruído branco usado como base dos efeitos sonoros
// ============================================================================

export function criarRuidoBuffer(ctx, duracao) {
  const tamanho = Math.max(1, Math.floor(ctx.sampleRate * duracao));
  const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < tamanho; i++) dados[i] = Math.random() * 2 - 1;
  return buffer;
}
