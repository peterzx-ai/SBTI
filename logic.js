import { personalities } from './data.js';

/**
 * 核心匹配逻辑
 * @param {Array} answers - 用户选择的答案列表 [{score: 'A', tag: '事业'}, ...]
 * @returns {Object} 匹配的人格对象
 */
export function getPersonality(answers) {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    const tagCounts = {};

    answers.forEach(ans => {
        counts[ans.score]++;
        tagCounts[ans.tag] = (tagCounts[ans.tag] || 0) + 1;
    });

    // 找到出现次数最高的分组
    let maxGroup = 'A';
    if (counts.B > counts[maxGroup]) maxGroup = 'B';
    if (counts.C > counts[maxGroup]) maxGroup = 'C';
    if (counts.D > counts[maxGroup]) maxGroup = 'D';

    // 在最高分分组内，根据 tag 细分
    const candidates = Object.values(personalities).filter(p => p.cluster === maxGroup);
    
    // 如果该分组只有一个候选人（例如 D 组其实也是有细分的），直接返回
    if (candidates.length === 1) return candidates[0];

    // 根据 tag 匹配度排序
    candidates.sort((a, b) => {
        const scoreA = tagCounts[a.tag] || 0;
        const scoreB = tagCounts[b.tag] || 0;
        return scoreB - scoreA;
    });

    return candidates[0];
}

/**
 * 抽题逻辑
 * 前 10 题抽 6 题，11-20 题抽 6 题，21-32 题抽 8 题
 */
export function getRandomQuestions(allQuestions) {
    const g1 = allQuestions.filter(q => q.group === 1);
    const g2 = allQuestions.filter(q => q.group === 2);
    const g3 = allQuestions.filter(q => q.group === 3);

    return [
        ...shuffle(g1).slice(0, 6),
        ...shuffle(g2).slice(0, 6),
        ...shuffle(g3).slice(0, 8)
    ];
}

function shuffle(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}
