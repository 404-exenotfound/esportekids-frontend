import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCarregarProgresso, useSalvarProgresso } from "../api/progresso";
import { CONQUISTAS } from "../educacional/data/conquistas";

// Espera um pouco depois da última mudança antes de salvar, para uma
// sequência de ações (ex.: terminar o quiz) virar uma chamada só.
const ESPERA_PARA_SALVAR = 1000; // ms

// Mantém o progresso do navegador e o do banco iguais, sem desenhar nada.
//   1) Ao entrar: busca o progresso salvo e mescla com o do navegador.
//   2) Depois: a cada mudança, envia o estado completo (com as conquistas).
// Só começa a salvar depois do passo 1, senão um navegador vazio apagaria o
// que está no banco. Montado com key = id do usuário (ver Layout).
export const SincronizarProgresso = () => {
  const { estrelas, curiosidadesLidas, jogosLiberados } = useSelector((s) => s.progresso);
  const { isSuccess: carregado } = useCarregarProgresso();
  const { mutate: salvar } = useSalvarProgresso();

  useEffect(() => {
    if (!carregado) return undefined;
    const espera = setTimeout(() => {
      salvar({
        estrelas,
        curiosidades_lidas: curiosidadesLidas,
        jogos_liberados: jogosLiberados,
        conquistas: CONQUISTAS.filter((c) => c.ok({ estrelas, curiosidadesLidas })).map((c) => c.id),
      });
    }, ESPERA_PARA_SALVAR);
    return () => clearTimeout(espera);
  }, [carregado, estrelas, curiosidadesLidas, jogosLiberados, salvar]);

  return null;
};
