import { AssessmentResult, CandidateInfo, QuestionItem, QuestionOption, SectionAnalysis, MarkingScheme } from '../types';

export const DEFAULT_MARKING_SCHEMES: MarkingScheme[] = [
  {
    id: 'cil_mt_standard',
    name: 'CIL MT Standard (+1 / 0)',
    positiveMarks: 1,
    negativeMarks: 0,
    description: '1 Mark per correct question. No negative marking.'
  },
  {
    id: 'cil_mt_neg',
    name: 'CIL MT with Negative (+1 / -0.25)',
    positiveMarks: 1,
    negativeMarks: 0.25,
    description: '1 Mark per correct question. 0.25 negative marks per incorrect answer.'
  },
  {
    id: 'ssc_standard',
    name: 'SSC CGL / CHSL (+2 / -0.5)',
    positiveMarks: 2,
    negativeMarks: 0.5,
    description: '2 Marks per correct question. 0.5 negative deduction.'
  },
  {
    id: 'rrb_standard',
    name: 'RRB / Gate Pattern (+1 / -0.33)',
    positiveMarks: 1,
    negativeMarks: 0.333,
    description: '1 Mark per correct question. 1/3 negative deduction.'
  }
];

function normalizeOpt(val: string | null | undefined): { char: string; num: number } | null {
  if (!val) return null;
  const clean = val.trim().toUpperCase();
  if (clean === 'A' || clean === '1') return { char: 'A', num: 1 };
  if (clean === 'B' || clean === '2') return { char: 'B', num: 2 };
  if (clean === 'C' || clean === '3') return { char: 'C', num: 3 };
  if (clean === 'D' || clean === '4') return { char: 'D', num: 4 };
  if (clean === 'E' || clean === '5') return { char: 'E', num: 5 };
  return null;
}

export function parseDigiALMHtml(htmlText: string, markingScheme: MarkingScheme = DEFAULT_MARKING_SCHEMES[0]): AssessmentResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  // Fix relative images to DigiALM CDN
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && (src.startsWith('/') || !src.startsWith('http'))) {
      img.setAttribute('src', `https://cdn.digialm.com${src.startsWith('/') ? '' : '/'}${src}`);
    }
  });

  // 1. Candidate Details
  const candidateInfo: CandidateInfo = {};
  const infoRows = doc.querySelectorAll('.main-info-pnl tr, .main-info-tbl tr, table.main-info-tbl tr');
  infoRows.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    for (let i = 0; i < tds.length; i += 2) {
      if (tds[i] && tds[i + 1]) {
        const key = tds[i].textContent?.trim().replace(/:$/, '') || '';
        const val = tds[i + 1].textContent?.trim() || '';
        if (key) {
          if (/participant\s*id/i.test(key)) candidateInfo.participantId = val;
          else if (/participant\s*name/i.test(key)) candidateInfo.participantName = val;
          else if (/test\s*center/i.test(key)) candidateInfo.testCenterName = val;
          else if (/test\s*date/i.test(key)) candidateInfo.testDate = val;
          else if (/test\s*time/i.test(key)) candidateInfo.testTime = val;
          else if (/subject/i.test(key)) candidateInfo.subject = val;
          else candidateInfo[key] = val;
        }
      }
    }
  });

  // 2. Identify Section Elements
  // DigiALM might have .grp-cntnr wrapping .section-cntnr. We want the leaf sections or unique section-cntnr.
  let sectionEls = Array.from(doc.querySelectorAll('.section-cntnr'));
  if (sectionEls.length === 0) {
    sectionEls = Array.from(doc.querySelectorAll('.grp-cntnr'));
  }
  // If there are no explicit section containers, find all question panels
  if (sectionEls.length === 0) {
    sectionEls = [doc.body];
  }

  const sections: SectionAnalysis[] = [];
  const allQuestions: QuestionItem[] = [];
  let globalQIndex = 1;

  sectionEls.forEach((secEl, sIdx) => {
    // Determine section name
    let secName = '';
    const lblEl = secEl.querySelector('.section-lbl, .grp-lbl');
    if (lblEl) {
      secName = lblEl.textContent?.replace(/Section\s*:\s*/i, '').trim() || '';
    }
    if (!secName) {
      const heading = secEl.querySelector('b, strong, .bold');
      secName = heading?.textContent?.trim() || `Section ${sIdx + 1}`;
    }

    const questionEls = Array.from(secEl.querySelectorAll('.question-pnl'));
    if (questionEls.length === 0) return;

    const sectionQuestions: QuestionItem[] = [];

    questionEls.forEach((qEl) => {
      // Menu table holds metadata
      const menuTbl = qEl.querySelector('.menu-tbl');
      const menuData: Record<string, string> = {};
      if (menuTbl) {
        menuTbl.querySelectorAll('tr').forEach(tr => {
          const tds = tr.querySelectorAll('td');
          if (tds.length >= 2) {
            const k = tds[0].textContent?.trim().replace(/:$/, '').trim() || '';
            const v = tds[1].textContent?.trim() || '';
            if (k) menuData[k] = v;
          }
        });
      }

      const qId = menuData['Question ID'] || menuData['Question ID :'] || `${globalQIndex}`;
      const rawStatus = menuData['Status'] || menuData['Status :'] || 'Not Answered';
      const rawChosen = menuData['Chosen Option'] || menuData['Chosen Option :'] || '--';

      // Question text & HTML
      const qRowTbl = qEl.querySelector('.questionRowTbl, .questionPnlTbl');
      let questionText = '';
      let questionHtml = '';

      if (qRowTbl) {
        const textTd = qRowTbl.querySelector('td.bold[style*="text-align"], td.bold[valign="top"]:not([align="center"])');
        if (textTd) {
          questionText = textTd.textContent?.trim() || '';
          questionHtml = textTd.innerHTML.trim();
        } else {
          const boldTds = qRowTbl.querySelectorAll('td.bold');
          if (boldTds.length > 1) {
            questionText = boldTds[1].textContent?.trim() || '';
            questionHtml = boldTds[1].innerHTML.trim();
          }
        }
      }

      // Options
      const optionsList: QuestionOption[] = [];
      let rightOptionChar: string | null = null;
      let rightOptionIndex = -1;

      const optRows = Array.from(qEl.querySelectorAll('.questionRowTbl tr')).filter(tr => {
        return tr.querySelector('.rightAns, .wrngAns, td[class*="Ans"]') !== null;
      });

      optRows.forEach((optTr, optIdx) => {
        const isRight = optTr.querySelector('.rightAns') !== null || optTr.classList.contains('rightAns');
        const optTd = optTr.querySelector('.rightAns, .wrngAns, td:last-child') || optTr.lastElementChild;
        const fullOptText = optTd?.textContent?.trim() || '';
        const optHtml = optTd?.innerHTML || fullOptText;

        const match = fullOptText.match(/^([A-E1-5])\.\s*(.*)/);
        const defaultChar = ['A', 'B', 'C', 'D', 'E'][optIdx] || 'A';
        const optChar = match ? match[1].toUpperCase() : defaultChar;
        const optText = match ? match[2] : fullOptText;
        const optId = menuData[`Option ${optIdx + 1} ID`] || menuData[`Option ${optIdx + 1} ID :`];

        optionsList.push({
          index: optIdx + 1,
          char: defaultChar,
          text: optText,
          isCorrect: isRight,
          html: optHtml,
          optionId: optId
        });

        if (isRight) {
          rightOptionIndex = optIdx + 1;
          rightOptionChar = defaultChar;
        }
      });

      // Evaluation
      const normChosen = normalizeOpt(rawChosen);
      const normRight = normalizeOpt(rightOptionChar) || (rightOptionIndex > 0 ? { char: ['A', 'B', 'C', 'D', 'E'][rightOptionIndex - 1], num: rightOptionIndex } : null);

      let isAttempted = false;
      let isCorrect = false;
      let isWrong = false;
      let marksObtained = 0;

      if (normChosen && rawChosen !== '--' && rawChosen !== '' && !/not\s*answered/i.test(rawStatus)) {
        isAttempted = true;
        if (normRight && (normChosen.char === normRight.char || normChosen.num === normRight.num)) {
          isCorrect = true;
          marksObtained = markingScheme.positiveMarks;
        } else {
          isWrong = true;
          marksObtained = -markingScheme.negativeMarks;
        }
      }

      const qItem: QuestionItem = {
        qNumber: globalQIndex++,
        qId,
        sectionIndex: sIdx,
        sectionName: secName,
        questionText: questionText || `Question ${globalQIndex - 1}`,
        questionHtml: questionHtml || undefined,
        options: optionsList,
        chosenOption: normChosen ? normChosen.char : null,
        rightOption: normRight ? normRight.char : null,
        isAttempted,
        isCorrect,
        isWrong,
        status: rawStatus,
        marksObtained
      };

      sectionQuestions.push(qItem);
      allQuestions.push(qItem);
    });

    if (sectionQuestions.length > 0) {
      const correctCount = sectionQuestions.filter(q => q.isCorrect).length;
      const incorrectCount = sectionQuestions.filter(q => q.isWrong).length;
      const attemptedCount = sectionQuestions.filter(q => q.isAttempted).length;
      const unattemptedCount = sectionQuestions.length - attemptedCount;
      const secMarks = (correctCount * markingScheme.positiveMarks) - (incorrectCount * markingScheme.negativeMarks);
      const maxMarks = sectionQuestions.length * markingScheme.positiveMarks;
      const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 1000) / 10 : 0;
      const attemptRate = Math.round((attemptedCount / sectionQuestions.length) * 1000) / 10;

      sections.push({
        sectionIndex: sIdx,
        name: secName,
        questionsCount: sectionQuestions.length,
        attempted: attemptedCount,
        correct: correctCount,
        incorrect: incorrectCount,
        unattempted: unattemptedCount,
        marksObtained: Math.round(secMarks * 100) / 100,
        maxMarks,
        accuracy,
        attemptRate,
        questions: sectionQuestions
      });
    }
  });

  const totalQuestions = allQuestions.length;
  const totalCorrect = allQuestions.filter(q => q.isCorrect).length;
  const totalIncorrect = allQuestions.filter(q => q.isWrong).length;
  const totalAttempted = allQuestions.filter(q => q.isAttempted).length;
  const totalUnattempted = totalQuestions - totalAttempted;
  const totalMarksObtained = Math.round(((totalCorrect * markingScheme.positiveMarks) - (totalIncorrect * markingScheme.negativeMarks)) * 100) / 100;
  const totalMaxMarks = totalQuestions * markingScheme.positiveMarks;
  const percentage = totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 1000) / 10 : 0;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 1000) / 10 : 0;

  // Paper 1 (sections 0-3: Non-tech, first 100 Qs) vs Paper 2 (section 4: Domain tech, 100 Qs) for CIL MT
  let paper1Score;
  let paper2Score;

  if (sections.length >= 2) {
    // If 5 sections (standard CIL MT), first 4 are Paper 1 (GK, Quant, Reasoning, English) and 5th is Paper 2 (Domain)
    const p1Sections = sections.length >= 5 ? sections.slice(0, 4) : [sections[0]];
    const p2Sections = sections.length >= 5 ? sections.slice(4) : sections.slice(1);

    const p1Correct = p1Sections.reduce((acc, s) => acc + s.correct, 0);
    const p1Wrong = p1Sections.reduce((acc, s) => acc + s.incorrect, 0);
    const p1Unattempted = p1Sections.reduce((acc, s) => acc + s.unattempted, 0);
    const p1Max = p1Sections.reduce((acc, s) => acc + s.maxMarks, 0);
    const p1Marks = Math.round(((p1Correct * markingScheme.positiveMarks) - (p1Wrong * markingScheme.negativeMarks)) * 100) / 100;

    const p2Correct = p2Sections.reduce((acc, s) => acc + s.correct, 0);
    const p2Wrong = p2Sections.reduce((acc, s) => acc + s.incorrect, 0);
    const p2Unattempted = p2Sections.reduce((acc, s) => acc + s.unattempted, 0);
    const p2Max = p2Sections.reduce((acc, s) => acc + s.maxMarks, 0);
    const p2Marks = Math.round(((p2Correct * markingScheme.positiveMarks) - (p2Wrong * markingScheme.negativeMarks)) * 100) / 100;

    paper1Score = { marks: p1Marks, maxMarks: p1Max, correct: p1Correct, wrong: p1Wrong, unattempted: p1Unattempted };
    paper2Score = { marks: p2Marks, maxMarks: p2Max, correct: p2Correct, wrong: p2Wrong, unattempted: p2Unattempted };
  }

  const examTitle = candidateInfo.subject ? `Coal India Limited (CIL MT) - ${candidateInfo.subject}` : 'DigiALM Assessment Answer Key';

  return {
    candidateInfo,
    examTitle,
    totalQuestions,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    totalMarksObtained,
    totalMaxMarks,
    percentage,
    overallAccuracy,
    paper1Score,
    paper2Score,
    sections,
    questions: allQuestions
  };
}

export function reCalculateWithScheme(result: AssessmentResult, markingScheme: MarkingScheme): AssessmentResult {
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalAttempted = 0;

  const updatedQuestions = result.questions.map(q => {
    let marksObtained = 0;
    if (q.isCorrect) {
      marksObtained = markingScheme.positiveMarks;
      totalCorrect++;
      totalAttempted++;
    } else if (q.isWrong) {
      marksObtained = -markingScheme.negativeMarks;
      totalIncorrect++;
      totalAttempted++;
    }
    return {
      ...q,
      marksObtained
    };
  });

  const updatedSections = result.sections.map(sec => {
    const secQs = updatedQuestions.filter(q => q.sectionName === sec.name || q.sectionIndex === sec.sectionIndex);
    const c = secQs.filter(q => q.isCorrect).length;
    const w = secQs.filter(q => q.isWrong).length;
    const a = secQs.filter(q => q.isAttempted).length;
    const u = secQs.length - a;
    const marks = Math.round(((c * markingScheme.positiveMarks) - (w * markingScheme.negativeMarks)) * 100) / 100;
    const maxMarks = secQs.length * markingScheme.positiveMarks;
    const accuracy = a > 0 ? Math.round((c / a) * 1000) / 10 : 0;
    const attemptRate = secQs.length > 0 ? Math.round((a / secQs.length) * 1000) / 10 : 0;

    return {
      ...sec,
      correct: c,
      incorrect: w,
      attempted: a,
      unattempted: u,
      marksObtained: marks,
      maxMarks,
      accuracy,
      attemptRate,
      questions: secQs
    };
  });

  const totalQuestions = updatedQuestions.length;
  const totalUnattempted = totalQuestions - totalAttempted;
  const totalMarksObtained = Math.round(((totalCorrect * markingScheme.positiveMarks) - (totalIncorrect * markingScheme.negativeMarks)) * 100) / 100;
  const totalMaxMarks = totalQuestions * markingScheme.positiveMarks;
  const percentage = totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 1000) / 10 : 0;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 1000) / 10 : 0;

  let paper1Score;
  let paper2Score;

  if (updatedSections.length >= 2) {
    const p1Sections = updatedSections.length >= 5 ? updatedSections.slice(0, 4) : [updatedSections[0]];
    const p2Sections = updatedSections.length >= 5 ? updatedSections.slice(4) : updatedSections.slice(1);

    const p1Correct = p1Sections.reduce((acc, s) => acc + s.correct, 0);
    const p1Wrong = p1Sections.reduce((acc, s) => acc + s.incorrect, 0);
    const p1Unattempted = p1Sections.reduce((acc, s) => acc + s.unattempted, 0);
    const p1Max = p1Sections.reduce((acc, s) => acc + s.maxMarks, 0);
    const p1Marks = Math.round(((p1Correct * markingScheme.positiveMarks) - (p1Wrong * markingScheme.negativeMarks)) * 100) / 100;

    const p2Correct = p2Sections.reduce((acc, s) => acc + s.correct, 0);
    const p2Wrong = p2Sections.reduce((acc, s) => acc + s.incorrect, 0);
    const p2Unattempted = p2Sections.reduce((acc, s) => acc + s.unattempted, 0);
    const p2Max = p2Sections.reduce((acc, s) => acc + s.maxMarks, 0);
    const p2Marks = Math.round(((p2Correct * markingScheme.positiveMarks) - (p2Wrong * markingScheme.negativeMarks)) * 100) / 100;

    paper1Score = { marks: p1Marks, maxMarks: p1Max, correct: p1Correct, wrong: p1Wrong, unattempted: p1Unattempted };
    paper2Score = { marks: p2Marks, maxMarks: p2Max, correct: p2Correct, wrong: p2Wrong, unattempted: p2Unattempted };
  }

  return {
    ...result,
    totalQuestions,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    totalMarksObtained,
    totalMaxMarks,
    percentage,
    overallAccuracy,
    paper1Score,
    paper2Score,
    sections: updatedSections,
    questions: updatedQuestions
  };
}
