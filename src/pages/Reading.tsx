import { ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAtlas } from "../atlas/context";
import type { WordRef } from "../atlas/types";
import { ARTICLES, articleWords, type Article } from "../data/reading";
import { play } from "../lib/audio";
import { openWord } from "../lib/router";
import { Speak } from "../ui/Speak";

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface Seg {
  /** 原文片段。 */
  t: string;
  /** 命中的重点词（词库中的原形），未命中为 null。 */
  k: string | null;
}

/** 按重点词把英文段落切成「普通文本 / 命中词」交替的片段。 */
function splitKeys(text: string, keys: string[]): Seg[] {
  if (!keys.length) return [{ t: text, k: null }];
  const re = new RegExp(`\\b(${keys.map(esc).join("|")})(?:s|es|ed|d|ing|ies|ied)?\\b`, "gi");
  const out: Seg[] = [];
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ t: text.slice(last, m.index), k: null });
    out.push({ t: m[0], k: (m[1] ?? m[0]).toLowerCase() });
    last = m.index + m[0].length;
    if (re.lastIndex === m.index) re.lastIndex++;
  }
  if (last < text.length) out.push({ t: text.slice(last), k: null });
  return out;
}

export function Reading() {
  const [open, setOpen] = useState<string | null>(null);
  const article = ARTICLES.find((a) => a.id === open) ?? null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [open]);

  if (article) return <Reader article={article} onBack={() => setOpen(null)} />;

  return (
    <div className="page reading">
      <header className="page-head">
        <p className="eyebrow">外刊 · Reading Lab</p>
        <h1 className="display">读懂长句，才读得懂世界。</h1>
        <p className="lede">仿外刊风格的原创精读语料（非版权文章）：中英对照、重点词高亮，点词即可跳转词条并听英式发音。</p>
      </header>
      <div className="rd-list">
        {ARTICLES.map((a) => (
          <button key={a.id} className="rd-card" onClick={() => setOpen(a.id)}>
            <span className="rd-card-meta">
              <span className={`chip chip-level lv-${a.cefr}`}>{a.cefr}</span>
              <span className="muted">{articleWords(a)} 词</span>
            </span>
            <b lang="en">{a.title}</b>
            <small>{a.titleZh}</small>
            <p>{a.summary}</p>
            <span className="rd-card-go">开始精读 →</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Reader({ article, onBack }: { article: Article; onBack: () => void }) {
  const atlas = useAtlas();
  const [zh, setZh] = useState(true);

  const dict = useMemo(() => {
    const m = new Map<string, WordRef>();
    for (const w of atlas.words) m.set(w.word.toLowerCase(), w);
    return m;
  }, [atlas]);

  const vocab = useMemo(() => [...new Set(article.keys)].sort((a, b) => a.localeCompare(b)), [article]);
  const pattern = useMemo(() => [...vocab].sort((a, b) => b.length - a.length), [vocab]);

  return (
    <div className="page reading">
      <header className="rd-head">
        <button className="btn btn-ghost" onClick={onBack}>
          <ChevronLeft size={18} /> 外刊列表
        </button>
        <div className="segmented">
          <button className={zh ? "is-on" : ""} onClick={() => setZh(true)} aria-pressed={zh}>
            中英对照
          </button>
          <button className={!zh ? "is-on" : ""} onClick={() => setZh(false)} aria-pressed={!zh}>
            仅英文
          </button>
        </div>
      </header>

      <article className="rd-article">
        <p className="eyebrow">
          {article.source} · CEFR {article.cefr}
        </p>
        <h1 className="rd-title" lang="en">
          {article.title}
        </h1>
        <p className="rd-title-zh">{article.titleZh}</p>
        <p className="rd-summary">{article.summary}</p>
        <p className="muted rd-hint">{articleWords(article)} 词 · 点击高亮词可查义并听英式发音</p>

        {article.paras.map((p, i) => (
          <div className="rd-para" key={i}>
            <p className="rd-en" lang="en">
              {splitKeys(p.en, pattern).map((s, j) =>
                s.k === null ? <span key={j}>{s.t}</span> : <KeyWord key={j} raw={s.t} refw={dict.get(s.k)} />,
              )}
            </p>
            {zh && <p className="rd-zh">{p.zh}</p>}
          </div>
        ))}

        <section className="block">
          <h3 className="eyebrow">重点词汇</h3>
          <ul className="rd-keys">
            {vocab.map((k) => {
              const r = dict.get(k);
              return (
                <li key={k}>
                  {r ? (
                    <button className="link" onClick={() => openWord(r.id)}>
                      {r.word}
                    </button>
                  ) : (
                    <span className="rd-unknown">{k}</span>
                  )}
                  <Speak url={r ? atlas.audio(r, "uk") : null} text={k} accent="uk" size="sm" className="rel-speak" />
                  {r && <small>{r.zh}</small>}
                </li>
              );
            })}
          </ul>
        </section>
      </article>
    </div>
  );
}

function KeyWord({ raw, refw }: { raw: string; refw?: WordRef }) {
  if (refw)
    return (
      <button className="rd-key" onClick={() => openWord(refw.id)} title={`查看 ${refw.word}`}>
        {raw}
      </button>
    );
  return (
    <button className="rd-key is-new" onClick={() => void play(null, raw, "uk")} title="词库暂无此词，点按听发音">
      {raw}
    </button>
  );
}
