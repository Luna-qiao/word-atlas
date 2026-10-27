import { PenLine, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PROMPTS, TASK_LABEL, TASK_TARGET, type TaskKind } from "../data/writing";
import { countWords } from "../lib/essay";
import { studio, useStudio } from "../store/studio";

const TASKS: TaskKind[] = ["task1", "task2"];

const fmt = (t: number) => new Date(t).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export function Writing() {
  const essays = useStudio((s) => s.essays);
  const [task, setTask] = useState<TaskKind>("task2");
  const [promptId, setPromptId] = useState<string | null>(() => PROMPTS.find((p) => p.task === "task2")?.id ?? null);
  const [text, setText] = useState("");

  const prompt = useMemo(() => PROMPTS.find((p) => p.id === promptId) ?? null, [promptId]);
  const list = useMemo(() => PROMPTS.filter((p) => p.task === task), [task]);
  const drafts = useMemo(() => [...essays].sort((a, b) => b.updated - a.updated), [essays]);

  useEffect(() => {
    setText(promptId ? studio.get().essays.find((e) => e.id === promptId)?.text ?? "" : "");
  }, [promptId]);

  const pick = (t: TaskKind) => {
    setTask(t);
    setPromptId(PROMPTS.find((p) => p.task === t)?.id ?? null);
  };

  const onText = (v: string) => {
    setText(v);
    if (!prompt) return;
    if (studio.get().essays.some((e) => e.id === prompt.id)) studio.patch(prompt.id, { text: v });
    else studio.put({ id: prompt.id, task: prompt.task, promptText: prompt.text, text: v });
  };

  const draftWords = (pid: string) => countWords(studio.get().essays.find((e) => e.id === pid)?.text ?? "");
  const titleOf = (pid: string) => PROMPTS.find((p) => p.id === pid)?.title ?? "自定义题目";

  const words = countWords(text);
  const target = prompt ? TASK_TARGET[prompt.task] : TASK_TARGET[task];
  const pct = target ? Math.min(100, (words / target) * 100) : 0;

  return (
    <div className="page writing">
      <header className="page-head">
        <p className="eyebrow">写作 · Writing Studio</p>
        <h1 className="display">先写出来，再写好。</h1>
        <p className="lede">雅思大小作文题库，页面内直接写作；草稿自动保存在本机浏览器，写完可去「点评」做一次自查。</p>
      </header>

      <div className="write-grid">
        <section className="panel">
          <h3 className="eyebrow">题型</h3>
          <div className="segmented segmented-wide">
            {TASKS.map((t) => (
              <button key={t} className={task === t ? "is-on" : ""} onClick={() => pick(t)} aria-pressed={task === t}>
                {TASK_LABEL[t]}
              </button>
            ))}
          </div>
          <h3 className="eyebrow">题目</h3>
          <div className="prompt-list">
            {list.map((p) => (
              <button key={p.id} className={`prompt-item ${promptId === p.id ? "is-on" : ""}`} onClick={() => setPromptId(p.id)} aria-pressed={promptId === p.id}>
                <b>{p.title}</b>
                <small>{draftWords(p.id)} 词草稿</small>
              </button>
            ))}
          </div>
          {prompt && (
            <div className="prompt-text">
              <p lang="en">{prompt.text}</p>
              <p className="muted">思路提示：{prompt.hint}</p>
            </div>
          )}
        </section>

        <section className="panel write-editor">
          <header className="write-meter">
            <span>
              <b>{words}</b> / {target} 词
            </span>
            <span className="muted">自动保存到本机</span>
          </header>
          <div className="write-bar" aria-hidden="true">
            <span className={words >= target ? "is-done" : ""} style={{ width: `${pct}%` }} />
          </div>
          <textarea
            className="write-area"
            value={text}
            onChange={(e) => onText(e.target.value)}
            placeholder="在这里写作… 建议先搭骨架：引言表态 → 主体分段论证 → 结论回扣立场。"
            spellCheck={false}
            aria-label="作文输入区"
          />
          <div className="write-actions">
            <span className="muted">{words >= target ? "已达到篇幅要求。" : `距 ${target} 词还差 ${Math.max(0, target - words)} 词。`}</span>
            <div className="summary-actions">
              <button className="btn btn-ghost" onClick={() => onText("")} disabled={!text}>
                清空
              </button>
              <a className="btn btn-primary" href="#/review">
                去点评 <PenLine size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="panel write-drafts">
          <h3 className="eyebrow">我的草稿（{drafts.length}）</h3>
          {drafts.length === 0 ? (
            <p className="muted">还没有草稿。选一道题开始写，内容会自动保存在这台设备上。</p>
          ) : (
            <ul className="draft-list">
              {drafts.map((d) => (
                <li key={d.id}>
                  <button
                    className="draft-open"
                    onClick={() => {
                      setTask(d.task);
                      setPromptId(d.id);
                    }}
                  >
                    <b>{titleOf(d.id)}</b>
                    <small>
                      {TASK_LABEL[d.task]} · {countWords(d.text)} 词 · {fmt(d.updated)}
                    </small>
                  </button>
                  <button className="icon-btn" onClick={() => studio.remove(d.id)} aria-label="删除草稿">
                    <Trash2 size={17} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
