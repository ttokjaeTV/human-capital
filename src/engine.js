/* ===== 미래 소득 현재가치(인적자본) 엔진 =====
   소득은 매달 말 받는다고 보고(월 할인율 = (1+연)^(1/12) − 1) 지금 가치로 할인. 수입은 수입 증가율, 생활비는 물가만큼 증가. */
function annuity12(m) { return Math.abs(m) < 1e-12 ? 12 : (Math.pow(1 + m, 12) - 1) / m; }
function pvYearFactor(d) {   // 연 금액을 12달 나눠 매달 말 받을 때, 그해 초 기준 현재가치 비율
  const m = Math.pow(1 + d, 1 / 12) - 1;
  return Math.abs(m) < 1e-12 ? 1 : (1 - Math.pow(1 + m, -12)) / m / 12;
}
function hcSim(p) {
  const N = Math.max(0, p.retire - p.age);
  const f = pvYearFactor(p.d), m = Math.pow(1 + p.d, 1 / 12) - 1;
  const rows = [];
  let hc = 0, nominal = 0, pvSave = 0, nomSave = 0;
  for (let k = 0; k < N; k++) {
    const inc = p.income * Math.pow(1 + p.g, k);
    const sp = p.spend * Math.pow(1 + p.inf, k);
    const disc = f / Math.pow(1 + p.d, k);
    hc += inc * disc; nominal += inc; pvSave += (inc - sp) * disc; nomSave += inc - sp;
    rows.push({ k, age: p.age + k, inc, sp, save: inc - sp, disc, pv: inc * disc, pvSave: (inc - sp) * disc });
  }
  // 나이별 생애 자산: 남은 인적자본(그 시점 가치) vs 금융자산
  const path = [];
  let A = p.assets;
  for (let t = 0; t <= N; t++) {
    let H = 0;
    for (let k = t; k < N; k++) H += rows[k].inc * f / Math.pow(1 + p.d, k - t);
    path.push({ t, age: p.age + t, A, H, ix: Math.pow(1 + p.inf, t) });
    if (t < N) {
      const s = rows[t].save;
      A = s >= 0 ? A * (1 + p.d) + s / 12 * annuity12(m) : Math.max(0, A + s) * (1 + p.d);
    }
  }
  const cross = path.find(x => x.t > 0 && x.A >= x.H && x.H > 0) || null;
  return { rows, hc, nominal, pvSave, nomSave, path, cross, N, last: rows.length ? rows[rows.length - 1].inc : 0 };
}
if (typeof module !== 'undefined') module.exports = { hcSim, pvYearFactor, annuity12 };
