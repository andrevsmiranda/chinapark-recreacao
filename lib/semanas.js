// Programação em duas semanas alternadas — P1 e P2.
// A equipe roda duas grades diferentes que se revezam: uma semana P1, a seguinte P2.
// Ninguém troca nada na mão: a semana vigente sai do calendário, contando semanas
// inteiras desde uma ÂNCORA (a segunda-feira de uma semana que sabidamente é P1).
//
// Formato salvo (v2):
//   { v:2, ancora:'2026-08-24', p1:{adulto,712,46}, p2:{adulto,712,46} }
// O formato antigo (só as faixas na raiz) é lido como P1 e duplicado em P2.
(function (raiz) {
  var ANCORA_PADRAO = '2026-08-24'; // segunda-feira; ajustável pela tela do admin

  function segundaDe(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var dia = x.getDay();               // 0=dom … 6=sáb
    x.setDate(x.getDate() - (dia === 0 ? 6 : dia - 1)); // volta até segunda
    return x;
  }

  function dataDe(iso) {
    var p = String(iso || ANCORA_PADRAO).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  // 'p1' ou 'p2' para a data dada (hoje, por padrão)
  function semanaVigente(ancoraIso, quando) {
    var hoje = segundaDe(quando || new Date());
    var base = segundaDe(dataDe(ancoraIso));
    var semanas = Math.round((hoje - base) / 604800000); // 7 dias em ms
    return (((semanas % 2) + 2) % 2) === 0 ? 'p1' : 'p2';
  }

  // Aceita o formato antigo e o novo; sempre devolve o envelope v2
  function normalizar(dados, faixas, base) {
    faixas = faixas || ['adulto', '712', '46'];
    if (dados && dados.v === 2 && dados.p1 && dados.p2) {
      if (!dados.ancora) dados.ancora = ANCORA_PADRAO;
      return dados;
    }
    var grade = dados && (dados.adulto || dados['712'] || dados['46'])
      ? dados
      : JSON.parse(JSON.stringify(base || {}));
    return {
      v: 2,
      ancora: ANCORA_PADRAO,
      p1: JSON.parse(JSON.stringify(grade)),
      p2: JSON.parse(JSON.stringify(grade)), // começa igual; a equipe edita a P2
    };
  }

  // Move a âncora uma semana para trás/frente — é assim que se corrige
  // "esta semana era a outra" com um clique, sem mexer nas grades.
  function inverterAncora(ancoraIso) {
    var d = segundaDe(dataDe(ancoraIso));
    d.setDate(d.getDate() + 7);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  raiz.CPSemanas = {
    ANCORA_PADRAO: ANCORA_PADRAO,
    semanaVigente: semanaVigente,
    normalizar: normalizar,
    inverterAncora: inverterAncora,
    segundaDe: segundaDe,
  };
})(typeof window !== 'undefined' ? window : globalThis);
