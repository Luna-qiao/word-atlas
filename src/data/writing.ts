export type TaskKind = "task1" | "task2";

export interface Prompt {
  id: string;
  task: TaskKind;
  /** Short label for the picker. */
  title: string;
  text: string;
  /** Chinese structural hint. */
  hint: string;
}

export const TASK_TARGET: Record<TaskKind, number> = { task1: 150, task2: 250 };

export const TASK_LABEL: Record<TaskKind, string> = { task1: "Task 1 · 小作文", task2: "Task 2 · 大作文" };

export const PROMPTS: Prompt[] = [
  {
    id: "t1-housing",
    task: "task1",
    title: "住房所有权变化",
    text: "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    hint: "首段改写题目；主体段按时间趋势与对比分段；结尾不必给观点，只做总体归纳。",
  },
  {
    id: "t1-emissions",
    task: "task1",
    title: "人均碳排放对比",
    text: "The graph below shows average carbon dioxide (CO2) emissions per person in the United Kingdom, Sweden, Italy and Portugal between 1967 and 2007. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    hint: "用「起点—变化—终点」描述每条曲线，突出最高值与交叉点，避免逐条罗列数字。",
  },
  {
    id: "t1-milk",
    task: "task1",
    title: "牛奶加工流程",
    text: "The diagram below shows the process by which milk and related products are produced. Summarise the information by selecting and reporting the main features.",
    hint: "流程图用被动语态与时间连接词（first, then, subsequently, finally），按步骤顺序描述。",
  },
  {
    id: "t2-university",
    task: "task2",
    title: "大学的功能",
    text: "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake. Discuss both views and give your own opinion.",
    hint: "四段式：引言（改写+表明立场）→ 观点 A + 例子 → 观点 B + 让步 → 结论重申。",
  },
  {
    id: "t2-fastfood",
    task: "task2",
    title: "对不健康食品征税",
    text: "In some countries, an increasing number of people are suffering from health problems as a result of eating too much fast food. Some governments are therefore imposing a tax on unhealthy food. To what extent do you agree or disagree?",
    hint: "立场要单一而清晰；主体段用「论点—解释—例证—回扣」四步展开，避免罗列。",
  },
  {
    id: "t2-community",
    task: "task2",
    title: "社区服务是否必修",
    text: "Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?",
    hint: "可先承认合理之处（培养责任感），再指出强制的问题（时间成本、动机扭曲），最后给折中建议。",
  },
  {
    id: "t2-social",
    task: "task2",
    title: "社交媒体的影响",
    text: "Many people believe that social networking sites have had a huge negative impact on both individuals and society. To what extent do you agree or disagree?",
    hint: "避免绝对化：区分「个体」与「社会」两个层面，各写一段，用具体场景支撑。",
  },
];
