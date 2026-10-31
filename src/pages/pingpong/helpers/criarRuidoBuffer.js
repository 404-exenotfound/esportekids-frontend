// ============================================================================
// criarRuidoBuffer — buffer de ruído branco para efeitos sonoros
// ----------------------------------------------------------------------------
// Gera um buffer de áudio com amostras aleatórias (ruído branco) de uma
// duração em segundos. É a matéria-prima dos efeitos de "ponto" e "erro",
// que depois passam por filtros para virar som de torcida/assovio.
// ============================================================================

export function criarRuidoBuffer(ctx, duracao) {
  const tamanho = Math.max(1, Math.floor(ctx.sampleRate * duracao)); // nº de amostras
  const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < tamanho; i++) dados[i] = Math.random() * 2 - 1; // -1 a 1
  return buffer;
}