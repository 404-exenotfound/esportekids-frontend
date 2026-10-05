// ============================================================================
// sorteiaFrase — escolhe uma frase aleatória de uma lista
// ----------------------------------------------------------------------------
// Usado para o banner de ponto/erro: pega um índice aleatório dentro do array
// de frases e devolve a frase correspondente.
// ============================================================================

export function sorteiaFrase(frases) {
  return frases[Math.floor(Math.random() * frases.length)];
}