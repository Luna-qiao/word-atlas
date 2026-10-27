import { ClipboardCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { PROMPTS, TASK_LABEL } from "../data/writing";
import { analyze, type Level } from "../lib/essay";
import { useStudio } from "../store/studio";

const LEVEL: Record<Level, string> = { solid: "达标", developing: "待加强", weak: "偏弱" };

export function Review() {
  const essays = useStudio((s) => s.essays);
  const [id, setId] = useState<string | null>(null);
  const drafts = useMemo(() => [...essays].sort((a, b) => b.updated - a.updated).filter((e) => e.text.trim()), [essays]);
  const current = drafts.find((e) => e.id === id) ?? drafts[0] ?? null;
  const report = useMemo(() => (current ? analyze(current.text, current.task) : null), [current]);
  const titleOf = (pid: string) => PROMPTS.find((p) => p.id === pid)?.title ?? "自定义题目";

  if (!drafts.length)
    return (
      <div className="page review">
        <header className="page-head">
          <p className="eyebrow">点评 · Self Review</p>
          <h1 className="display">先写，再来照照镜子。</h1>
          <p className="lede">点评完全在本地完成：按雅思四项评分维度做字数与结构检查，不上传任何内容。</p>
        </header>
        <section className="panel rep-empty">
          <ClipboardCheck size={30} strokeWidth={1.6} />
          <p>还没有可点评的作文。先去「写作」写一篇，回来就能看到自查报告。</p>
          <a className="btn btn-primary" href="#/writing">
            去写作
          </a>
        </section>
      </div>
    );

  return (
    <div className="page review">
      <header className="page-head">
        <p className="eyebrow">点评 · Self Review</p>
        <h1 className="display">本地自查，逐条改进。</h1>
        <p className="lede">按四项评分维度逐条检查，先动手改最弱的那一项。</p>
      </header>

      {drafts.length > 1 && (
        <div className="rep-picker">
          {drafts.map((d) => (
            <button key={d.id} className={`chip-btn ${current?.id === d.id ? "is-on" : ""}`} onClick={() => setId(d.id)}>
              {titleOf(d.id)}
            </button>
          ))}
        </div>
      )}

      {current && report && (
        <div className="rep-grid">
          <section className="panel rep-main">
            <p className="eyebrow">{TASK_LABEL[current.task]}</p>
            <h2 className="rep-title">{titleOf(current.id)}</h2>
            <dl className="rep-stats">
              <div>
                <dt>词数</dt>
                <dd>
                  {report.words}
                  <small> / {report.target}</small>
                </dd>
              </div>
              <div>
                <dt>句子</dt>
                <dd>{report.sentences}</dd>
              </div>
              <div>
                <dt>段落</dt>
                <dd>{report.paragraphs}</dd>
              </div>
              <div>
                <dt>平均句长</dt>
                <dd>
                  {report.avgSentence.toFixed(1)}
                  <small> 词</small>
                </dd>
              </div>
            </dl>

            <div className="rep-criteria">
              {report.criteria.map((c) => (
                <article key={c.key} className={`crit-card is-${c.level}`}>
                  <header>
                    <b>{c.label}</b>
                    <span className="crit-badge">{LEVEL[c.level]}</span>
                  </header>
                  <p className="crit-en">{c.en}</p>
                  <p>{c.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel rep-side">
            <h3 className="eyebrow">衔接词</h3>
            <p className="rep-chips">
              {report.linkers.length ? report.linkers.map((l) => <span key={l} className="chip is-ok">{l}</span>) : <span className="muted">暂未检测到明显的衔接词。</span>}
            </p>
            {report.missing.length > 0 && <p className="muted">还缺这些类别：{report.missing.join("、")}</p>}

            <h3 className="eyebrow">高频实词</h3>
            <p className="rep-chips">
              {report.repeated.length ? report.repeated.map((r) => <span key={r.word} className="chip">{r.word} ×{r.n}</span>) : <span className="muted">没有明显重复。</span>}
            </p>

            <h3 className="eyebrow">改进清单</h3>
            <ul className="rep-todos">
              {report.todos.length ? report.todos.map((t) => <li key={t}>{t}</li>) : <li>四项都已达标，可以继续打磨词句的精确度。</li>}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
