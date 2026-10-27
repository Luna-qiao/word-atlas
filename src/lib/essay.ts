import { TASK_TARGET, type TaskKind } from "../data/writing";

export const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

export type Level = "solid" | "developing" | "weak";

export interface Criterion {
  key: string;
  label: string;
  en: string;
  level: Level;
  note: string;
}

export interface EssayReport {
  words: number;
  target: number;
  sentences: number;
  paragraphs: number;
  avgSentence: number;
  linkers: string[];
  missing: string[];
  repeated: { word: string; n: number }[];
  criteria: Criterion[];
  todos: string[];
}

/** [类别, 触发词] — 只做本地规则匹配，不上传任何内容。 */
const LINKERS: [string, string[]][] = [
  ["递进", ["moreover", "furthermore", "in addition", "additionally", "what is more", "besides"]],
  ["转折", ["however", "nevertheless", "nonetheless", "on the other hand", "whereas", "although", "though", "even though"]],
  ["因果", ["therefore", "consequently", "as a result", "thus", "hence", "because", "since", "owing to", "due to"]],
  ["举例", ["for example", "for instance", "such as", "namely", "to illustrate"]],
  ["对比", ["in contrast", "by contrast", "on the contrary", "by comparison", "conversely"]],
  ["总结", ["in conclusion", "to conclude", "to sum up", "in summary", "overall", "in short"]],
];

const STOP = new Set(
  ("the a an and or but if of to in on at for with from by as is are was were be been being it its this that these those they them their there here " +
    "we our you your he she his her i me my not no do does did done have has had will would can could should may might must more most much many very " +
    "also than then when while which who whom whose what how why all any both each few other some such only own same so too about into over after before " +
    "between during without within because although however therefore people").split(/\s+/),
);

const sentences = (text: string) => text.split(/[.!?]+(?=\s|$)/).map((s) => s.trim()).filter((s) => s.length > 0);

const STEP: Record<Level, Level> = { solid: "developing", developing: "weak", weak: "weak" };

export function analyze(text: string, task: TaskKind): EssayReport {
  const target = TASK_TARGET[task];
  const words = countWords(text);
  const sents = sentences(text);
  const paras = text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const avgSentence = sents.length ? words / sents.length : 0;

  const lower = text.toLowerCase();
  const linkers: string[] = [];
  const missing: string[] = [];
  for (const [label, words_] of LINKERS) {
    const hit = words_.find((w) => lower.includes(w));
    if (hit) linkers.push(hit);
    else missing.push(label);
  }

  const tokens = (lower.match(/[a-z][a-z'-]{3,}/g) ?? []).filter((w) => !STOP.has(w));
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  const repeated = [...freq.entries()]
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, n]) => ({ word, n }));
  const variety = tokens.length ? new Set(tokens).size / tokens.length : 0;

  const criteria: Criterion[] = [];
  const todos: string[] = [];

  // 1. 任务回应
  let tr: Level = words >= target ? "solid" : words >= target * 0.85 ? "developing" : "weak";
  if (paras.length < 3) tr = STEP[tr];
  criteria.push({
    key: "tr",
    label: "任务回应",
    en: "Task Response",
    level: tr,
    note:
      tr === "solid"
        ? `共 ${words} 词，达到 ${target} 词的篇幅要求，观点有展开空间。`
        : `共 ${words} 词，距 ${target} 词还差 ${Math.max(0, target - words)} 词，论证容易被判定为不充分。`,
  });
  if (tr !== "solid") todos.push(`把篇幅补到 ${target} 词以上，每个主体段至少 3 句：论点、解释、例证。`);

  // 2. 连贯与衔接
  const used = LINKERS.length - missing.length;
  let cc: Level = used >= 4 ? "solid" : used >= 2 ? "developing" : "weak";
  if (paras.length < 3) cc = STEP[cc];
  criteria.push({
    key: "cc",
    label: "连贯与衔接",
    en: "Coherence & Cohesion",
    level: cc,
    note: paras.length
      ? `分了 ${paras.length} 段，使用了 ${used}/${LINKERS.length} 类衔接词。`
      : "还没有分段，建议至少「引言—主体—结论」三段。",
  });
  if (missing.length) todos.push(`补充缺失的衔接手段：${missing.join("、")}。`);
  if (paras.length < 3) todos.push("按段落组织：引言表态、主体分段论证、结论回扣立场。");

  // 3. 词汇资源
  let lr: Level = variety >= 0.62 ? "solid" : variety >= 0.48 ? "developing" : "weak";
  if (repeated.some((r) => r.n >= 6)) lr = STEP[lr];
  criteria.push({
    key: "lr",
    label: "词汇资源",
    en: "Lexical Resource",
    level: lr,
    note: `实词复用率 ${(variety * 100).toFixed(0)}%。${repeated.length ? `高频重复：${repeated.slice(0, 3).map((r) => `${r.word}×${r.n}`).join("、")}。` : "没有明显重复词。"}`,
  });
  if (lr !== "solid") todos.push("换用同义表达，避免同一个实词在文中反复出现。");

  // 4. 语法多样与准确
  let gra: Level = avgSentence >= 12 && avgSentence <= 26 ? "solid" : avgSentence >= 8 && avgSentence <= 32 ? "developing" : "weak";
  if (sents.length < 6) gra = STEP[gra];
  criteria.push({
    key: "gra",
    label: "语法多样与准确",
    en: "Grammatical Range & Accuracy",
    level: gra,
    note: sents.length ? `共 ${sents.length} 句，平均每句 ${avgSentence.toFixed(1)} 词。` : "还没有可分析的句子。",
  });
  if (gra !== "solid") todos.push("混合使用简单句、并列句和从句，把过短或过长的句子调匀。");

  return { words, target, sentences: sents.length, paragraphs: paras.length, avgSentence, linkers, missing, repeated, criteria, todos };
}
