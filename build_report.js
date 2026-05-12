// build_report.js
// Reads analysis.json (produced by analyze_competitors.js) and renders the
// Ember & Origin competitive analysis as a Word document.
//
// Setup:
//   npm install docx
//
// Run:
//   node build_report.js
//
// Optional: OUT_DIR=./out node build_report.js

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak,
} = require('docx');

const ANALYSIS_PATH = process.env.ANALYSIS_PATH || './analysis.json';
if (!fs.existsSync(ANALYSIS_PATH)) {
  console.error(`Missing ${ANALYSIS_PATH}. Run analyze_competitors.js first.`);
  process.exit(1);
}
const A = JSON.parse(fs.readFileSync(ANALYSIS_PATH, 'utf-8'));

// ---------- helpers ----------
const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const borders = { top: border, bottom: border, left: border, right: border };

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: 120 },
  ...opts,
  children: [new TextRun({ text, ...opts.run })],
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text })],
});
const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text })],
});
const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text })],
});

const bullet = (text) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text })],
});

const bulletBold = (label, text) => new Paragraph({
  numbering: { reference: 'bullets', level: 0 },
  spacing: { after: 80 },
  children: [
    new TextRun({ text: label, bold: true }),
    new TextRun({ text: ' ' + text }),
  ],
});

const codeBlock = (text) => new Paragraph({
  spacing: { after: 120, before: 60 },
  shading: { fill: 'F2F2F2', type: ShadingType.CLEAR },
  indent: { left: 240, right: 240 },
  children: [new TextRun({ text, font: 'Courier New', size: 18 })],
});

const cell = (text, opts = {}) => new TableCell({
  borders,
  width: { size: opts.width, type: WidthType.DXA },
  shading: opts.header ? { fill: '2E1F0F', type: ShadingType.CLEAR } : undefined,
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  children: (Array.isArray(text) ? text : [text]).map(t =>
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({
        text: String(t || ''),
        bold: opts.header || opts.bold,
        color: opts.header ? 'FFFFFF' : undefined,
        size: 20,
      })],
    })
  ),
});

// ---------- comparison matrix ----------
const matrixHeader = ['Dimension', ...A.matrix.map(m => m.competitor)];
const dimensions = [
  ['Positioning', 'positioning'],
  ['Core Message', 'core_message'],
  ['Product Differentiation', 'product_differentiation'],
  ['Sustainability Claims', 'sustainability_claims'],
  ['Website UX/Design', 'website_ux'],
  ['Gaps / Opportunities', 'gaps'],
];

const colCount = matrixHeader.length;
const firstColW = 1560;
const restW = Math.floor((9360 - firstColW) / (colCount - 1));
const colWidths = [firstColW, ...Array(colCount - 1).fill(restW)];
const matrixWidth = colWidths.reduce((a, b) => a + b, 0);

const matrixRows = [matrixHeader, ...dimensions.map(([label, key]) =>
  [label, ...A.matrix.map(m => m[key] || '')]
)];

const matrixTable = new Table({
  width: { size: matrixWidth, type: WidthType.DXA },
  columnWidths: colWidths,
  rows: matrixRows.map((row, rowIdx) =>
    new TableRow({
      tableHeader: rowIdx === 0,
      children: row.map((text, colIdx) => cell(text, {
        header: rowIdx === 0,
        bold: colIdx === 0 && rowIdx > 0,
        width: colWidths[colIdx],
      })),
    })
  ),
});

// ---------- content calendar ----------
const calHeader = ['Week', 'Theme', 'Blog', 'Email', 'Social'];
const calColWidths = [900, 1800, 2220, 2220, 2220];
const calRows = [calHeader, ...A.content_calendar.map(c =>
  [c.week, c.theme, c.blog, c.email, c.social]
)];
const calendarTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: calColWidths,
  rows: calRows.map((row, rowIdx) =>
    new TableRow({
      tableHeader: rowIdx === 0,
      children: row.map((text, colIdx) => cell(text, {
        header: rowIdx === 0,
        bold: (colIdx === 0 || colIdx === 1) && rowIdx > 0,
        width: calColWidths[colIdx],
      })),
    })
  ),
});

// ---------- document ----------
const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: 'EMBER & ORIGIN', bold: true, size: 44, color: '5C2E0F' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: 'Competitive Analysis & Go-to-Market Strategy', size: 28, color: '5C2E0F' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [new TextRun({ text: 'Single-origin, small-batch, roasted with intention.', italics: true, size: 22 })],
  }),

  h2('Executive Summary'),
  ...String(A.executive_summary || '').split(/\n\n+/).filter(Boolean).map(para => p(para)),

  h1('1. Screenshot Capture — Playwright'),
  p('Run capture_screenshots.js separately to save full-page screenshots of each competitor URL into ./screenshots/.'),
  codeBlock('node capture_screenshots.js'),

  h1('2. Competitive Comparison Matrix'),
  matrixTable,

  new Paragraph({ children: [new PageBreak()] }),

  h2('Key Takeaways'),
  ...(A.key_takeaways || []).map(k => bulletBold(k.label, k.text)),

  h1('3. Differentiation Strategies'),
  ...(A.differentiation_strategies || []).flatMap(s => [
    h3(s.title),
    p(s.rationale),
    bulletBold('Proof artifact:', s.proof_artifact),
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  h1('4. Four-Week Content Calendar'),
  p('Each week pairs one anchor blog post, one email, and a coordinated social push across IG, TikTok, and X.'),
  calendarTable,

  h1('5. Recommended Next Steps'),
  ...(A.next_steps || []).map(s => bullet(s)),

  new Paragraph({
    spacing: { before: 480 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: '— End of Document —', italics: true, color: '888888' })],
  }),
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Calibri', color: '5C2E0F' },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Calibri', color: '5C2E0F' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Calibri', color: '8B4513' },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const outDir = process.env.OUT_DIR || '.';
  const out = `${outDir}/Ember_and_Origin_Competitive_Analysis.docx`;
  fs.writeFileSync(out, buffer);
  console.log('Wrote:', out, buffer.length, 'bytes');
});
