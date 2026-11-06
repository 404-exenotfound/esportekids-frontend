import { describe, it, expect } from "vitest";
import { classificarDispositivo as c } from "./classificarDispositivo";

describe("classificarDispositivo", () => {
  it("iPhone em pé", () => {
    expect(c({ toque: true, larguraTela: 390, alturaTela: 844, larguraJanela: 390, alturaJanela: 664 }))
      .toEqual({ tipo: "celular", retrato: true });
  });
  it("celular Android deitado", () => {
    expect(c({ toque: true, larguraTela: 915, alturaTela: 412, larguraJanela: 915, alturaJanela: 360 }))
      .toEqual({ tipo: "celular", retrato: false });
  });
  it("iPad em pé", () => {
    expect(c({ toque: true, larguraTela: 768, alturaTela: 1024, larguraJanela: 768, alturaJanela: 954 }))
      .toEqual({ tipo: "tablet", retrato: true });
  });
  it("iPad Pro deitado", () => {
    expect(c({ toque: true, larguraTela: 1366, alturaTela: 1024, larguraJanela: 1366, alturaJanela: 954 }))
      .toEqual({ tipo: "tablet", retrato: false });
  });
  it("desktop com touch secundário", () => {
    expect(c({ toque: false, larguraTela: 1920, alturaTela: 1080, larguraJanela: 1920, alturaJanela: 960 }).tipo)
      .toBe("desktop");
  });
  it("desktop com janela estreita continua desktop", () => {
    expect(c({ toque: false, larguraTela: 1920, alturaTela: 1080, larguraJanela: 400, alturaJanela: 900 }).tipo)
      .toBe("desktop");
  });
});
