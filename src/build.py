"""src/ → index.html 빌드:  python src/build.py"""
from pathlib import Path
S = Path(__file__).parent
t = (S / 'template.html').read_text(encoding='utf-8')
eng = (S / 'engine.js').read_text(encoding='utf-8').replace("if (typeof module !== 'undefined') module.exports = { hcSim, pvYearFactor, annuity12 };\n", '')
t = t.replace('/*__BASE_CSS__*/\n', (S / 'base.css').read_text(encoding='utf-8'))
t = t.replace('/*__ENGINE__*/', eng).replace('세전·세후 입력값 기준', '세후 소득 기준')
assert '/*__' not in t
(S.parent / 'index.html').write_text(t, encoding='utf-8')
print('index.html', len(t))
