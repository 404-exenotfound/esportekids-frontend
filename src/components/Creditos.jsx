import "./Creditos.css";

const CREDITOS = [
  [
    { nome: "José Rodrigo", cargo: "Scrum Master" },
    { nome: "Matheus Caetano", cargo: "Product Owner" },
    { nome: "André Ribeiro", cargo: "Quality Assurance" },
  ],
  [
    { nome: "Natan Sousa", cargo: "Desenvolvedor" },
    { nome: "João Feijon", cargo: "Desenvolvedor" },
  ],
  [
    { nome: "Matheus Ferrarezi", cargo: "Desenvolvedor" },
    { nome: "Tiago Machado", cargo: "Desenvolvedor" },
  ],
];

export const Creditos = () => (
  <div className="ck-box-creditos">
    <p className="ck-box-creditos-titulo">CRÉDITOS</p>

    {CREDITOS.map((linha, index) => (
      <div key={index} className="ck-creditos-linha">
        {linha.map(({ nome, cargo }) => (
          <div key={nome} className="ck-creditos-item">
            <p className="ck-creditos-nome">{nome}</p>
            <p className="ck-creditos-cargo">{cargo}</p>
          </div>
        ))}
      </div>
    ))}
  </div>
);