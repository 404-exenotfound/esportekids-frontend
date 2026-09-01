// Ruído branco: a base da torcida sintetizada. É filtrado depois para virar
// grito (passa-banda) ou assobio (passa-alta).
export function criarRuidoBuffer(ctx, duracao) {
  const tamanho = Math.max(1, Math.floor(ctx.sampleRate * duracao));
  const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < tamanho; i++) dados[i] = Math.random() * 2 - 1;
  return buffer;
}
