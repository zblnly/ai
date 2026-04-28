const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const START_MARKER = '<!-- UPDATES_START -->';
const END_MARKER = '<!-- UPDATES_END -->';

// Commits to skip entirely (not user-facing)
const SKIP_PATTERNS = [
  /^添加项目 CLAUDE\.md/,
  /^添加项目默认规则/,
  /^Merge branch/,
  /^Fix root-level/,
  /GitHub Actions/i,
  /^Add \.nojekyll/,
  /^Trigger Pages/,
  /^Add GitHub Actions/,
];

// Lines to strip from commit body
const BODY_SKIP_PATTERNS = [
  /^Co-Authored-By:/,
  /^Signed-off-by:/,
  /^\s*$/,
];

function getGitLog(n = 15) {
  const output = execSync(
    `git log -${n} --format="%H|%as|%s"`,
    { encoding: 'utf-8', cwd: ROOT }
  );
  return output.trim().split('\n').filter(Boolean).map(line => {
    const [hash, date, ...msgParts] = line.split('|');
    return { hash: hash.slice(0, 7), date, message: msgParts.join('|') };
  });
}

function getNewFiles(hash) {
  try {
    return execSync(`git diff-tree --no-commit-id --name-only --diff-filter=A -r ${hash}`, {
      encoding: 'utf-8', cwd: ROOT,
    }).trim().split('\n').filter(Boolean);
  } catch { return []; }
}

function getChangedFiles(hash) {
  try {
    return execSync(`git diff-tree --no-commit-id --name-only -r ${hash}`, {
      encoding: 'utf-8', cwd: ROOT,
    }).trim().split('\n').filter(Boolean);
  } catch { return []; }
}

function getCommitBody(hash) {
  try {
    const raw = execSync(`git log --format=%b -n 1 ${hash}`, {
      encoding: 'utf-8', cwd: ROOT,
    });
    const lines = raw.trim().split('\n')
      .map(l => l.trim())
      .filter(l => !BODY_SKIP_PATTERNS.some(p => p.test(l)));
    return lines[0] || '';
  } catch { return ''; }
}

function findLinkForCommit(files, message) {
  // Only link to newly ADDED page files (not modified ones)
  for (const f of files) {
    if (f.startsWith('pages/') && f.endsWith('.html')) {
      return f;
    }
  }
  return null;
}

function getTag(message) {
  if (/变现|赞赏|支付|联盟|SEO|搜索/i.test(message)) return '功能更新';
  if (/修复|fix|bug/i.test(message)) return '修复';
  if (/体验|UI|CSS|样式|美化/i.test(message)) return '体验升级';
  if (/优化/i.test(message)) return '优化';
  if (/新增|添加|上线|新功能/i.test(message)) return '功能更新';
  if (/CLA?UDE\.md|规则|配置/i.test(message)) return '站点维护';
  if (/清理|清除|移除|删除/i.test(message)) return '站点维护';
  return null;
}

function generateUpdateItem(commit, newFiles) {
  const { hash, date, message } = commit;
  const shortDate = date.slice(5);
  const link = findLinkForCommit(newFiles, message);
  const bodyFirstLine = getCommitBody(hash);
  const tag = getTag(message);

  let html = '                <div class="update-item">\n';
  html += `                    <span class="update-date">${shortDate}</span>\n`;
  html += '                    <div class="update-body">\n';
  html += `                        <h4>${escapeHtml(message)}</h4>\n`;

  if (bodyFirstLine) {
    html += `                        <p>${escapeHtml(bodyFirstLine)}</p>\n`;
  }

  html += '                    </div>\n';
  if (link) {
    html += `                    <a href="${link}" class="btn-sm">查看 →</a>\n`;
  } else if (tag) {
    html += `                    <span class="tag">${tag}</span>\n`;
  }
  html += '                </div>';
  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function main() {
  const indexContent = fs.readFileSync(INDEX_PATH, 'utf-8');

  if (!indexContent.includes(START_MARKER)) {
    console.error('Error: START_MARKER not found in index.html');
    process.exit(1);
  }

  const commits = getGitLog(15);
  let updatesHtml = '';

  for (const commit of commits) {
    if (SKIP_PATTERNS.some(p => p.test(commit.message))) continue;

    const newFiles = getNewFiles(commit.hash);
    updatesHtml += generateUpdateItem(commit, newFiles) + '\n';
  }

  const newContent = indexContent.replace(
    new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
    `${START_MARKER}\n${updatesHtml}${END_MARKER}`
  );

  fs.writeFileSync(INDEX_PATH, newContent, 'utf-8');
  console.log(`Generated ${updatesHtml.split('update-item').length - 1} update items.`);
}

main();
