// ============================================================================
// sorteiaFrase — pega uma frase aleatória de uma lista
// ============================================================================

export function sorteiaFrase(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}
