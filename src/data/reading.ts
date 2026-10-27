export interface Para {
  en: string;
  zh: string;
}

export interface Article {
  id: string;
  title: string;
  titleZh: string;
  source: string;
  cefr: string;
  summary: string;
  paras: Para[];
  /** Key vocabulary. Words that exist in the atlas become clickable and get UK audio. */
  keys: string[];
}

/**
 * 仿外刊风格的原创精读语料，用于练习长句理解与学术词汇。
 * 内容为本项目自撰，不摘录任何受版权保护的文章。
 */
export const ARTICLES: Article[] = [
  {
    id: "four-day-week",
    title: "The Four-Day Week, Revisited",
    titleZh: "重新审视四天工作制",
    source: "精读示例 · 工作与科技",
    cefr: "B2",
    summary: "更短的一周，究竟是效率的敌人，还是注意力的朋友？",
    keys: ["firm", "critic", "collapse", "trial", "staff", "morale", "stress", "employer", "retain", "schedule", "engineer", "distract", "notification", "flexible", "evidence", "recovery"],
    paras: [
      {
        en: "A handful of firms have begun to experiment with a four-day working week. Critics predicted that output would collapse, yet the trial produced a different result: staff reported higher morale and less stress, and most employers chose to retain the shorter schedule.",
        zh: "少数公司已开始试行每周四天工作制。批评者曾预言产量会崩塌，但试验给出了不同的结果：员工反馈士气更高、压力更小，多数雇主最终选择保留这一更短的工作安排。",
      },
      {
        en: "The reasons are not hard to find. When engineers are not distracted by constant notifications, they finish deep work faster; when parents can pick up their children, they take fewer sick days. A flexible rhythm, rather than a longer one, seems to protect both health and output.",
        zh: "原因并不难找。当工程师不再被源源不断的通知打断，他们能更快完成深度工作；当父母能去接孩子，他们请病假的天数也更少。一种更灵活、而非更漫长的节奏，似乎同时保护了健康与产出。",
      },
      {
        en: "None of this means the idea is risk-free. Small firms may struggle to cover shifts, and a shorter week can tighten deadlines. Still, the evidence so far suggests that what employees gain in recovery, they often repay in focus.",
        zh: "这并不意味着该模式毫无风险。小公司可能难以排班，更短的周期也可能压缩工期。但现有证据表明，员工在恢复中获得的，往往会以专注力回报给公司。",
      },
    ],
  },
  {
    id: "wild-city",
    title: "Bringing the Wild Back to the City",
    titleZh: "把野性还给城市",
    source: "精读示例 · 环境与城市",
    cefr: "B2",
    summary: "一方水池、一排行道树，能否让水泥之城重新呼吸？",
    keys: ["planner", "urban", "wildlife", "resilient", "corridor", "habitat", "insect", "temperature", "absorb", "flood", "concrete", "budget", "resident", "maintain", "gradually"],
    paras: [
      {
        en: "For decades, planners treated nature as something waiting outside the city gate. Today a growing number of urban governments take the opposite view: wildlife belongs in the streets, and a city that makes room for it becomes more resilient in return.",
        zh: "几十年来，规划者把自然视为在城市门外等待之物。如今，越来越多的城市政府持相反态度：野生动物就属于街道，而为其留出空间的城，自身也变得更坚韧。",
      },
      {
        en: "Their tools are modest. A corridor of native plants along a railway line, a pond in a school yard, or a row of trees on a hot street can lower the local temperature and give insects and birds a place to feed. Such habitat also absorbs rain, easing the flood risk that concrete creates.",
        zh: "他们的工具并不复杂。沿铁轨种植的本地植物带、校园里的一方水池，或炎热街道上的一排行道树，都能降低局部气温，为昆虫和鸟类提供觅食之地。这样的栖息地还能吸纳雨水，缓解水泥带来的内涝风险。",
      },
      {
        en: "Critics warn that budgets are tight and that a few green patches cannot replace a forest. That is true. Yet residents who live beside these small habitats tend to defend them, and a defended patch, maintained year after year, gradually becomes something larger.",
        zh: "批评者警告说预算紧张，几块绿地取代不了一片森林。这话没错。但住在这些小栖息地旁的居民往往愿意守护它们；而一块被守护、年年维护的土地，会逐渐成长为更大的东西。",
      },
    ],
  },
  {
    id: "why-we-forget",
    title: "Why We Forget",
    titleZh: "我们为什么会遗忘",
    source: "精读示例 · 科学与学习",
    cefr: "C1",
    summary: "记忆不是仓库，而是一种需要按时浇灌的习惯。",
    keys: ["memory", "habit", "observe", "curve", "recall", "decline", "vanished", "repeat", "interval", "consolidate", "sleep", "essential", "session", "intense", "investment", "sustain", "pattern", "confirm", "cramming"],
    paras: [
      {
        en: "Memory is not a warehouse but a habit. Psychologists have long observed what they call the forgetting curve: without review, recall declines sharply within days, then more slowly, until a name or a date seems to have vanished.",
        zh: "记忆不是仓库，而是一种习惯。心理学家早已观察到所谓的遗忘曲线：若不复习，回忆会在几天内急剧下降，之后变慢，直到某个名字或日期仿佛已消失不见。",
      },
      {
        en: "The remedy is unglamorous. When learners repeat material at widening intervals, each successful recall consolidates the trace and pushes the next decline further away. Sleep plays a quiet but essential part, since much of this work happens after the lights go out.",
        zh: "解药并不光鲜。当学习者在不断拉长的间隔里重复材料时，每一次成功的回忆都会巩固记忆痕迹，让下一次遗忘来得更晚。睡眠在其中安静而关键，因为这项工作大多发生在熄灯之后。",
      },
      {
        en: "This is why a single long session, however intense, is a poor investment. Ten minutes a day, sustained for a month, will usually beat a weekend of cramming — a pattern that teachers have confirmed again and again in the classroom.",
        zh: "这就是为什么一次漫长的学习无论多么用力，都是糟糕的投资。每天十分钟、坚持一个月，通常胜过周末的突击——这一规律已被教师在课堂上反复验证。",
      },
    ],
  },
];

export const articleWords = (a: Article) => a.paras.reduce((n, p) => n + p.en.trim().split(/\s+/).length, 0);
