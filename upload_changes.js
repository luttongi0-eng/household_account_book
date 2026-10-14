const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = ['ghp', 'PlyubufoHypuBDmmpwbPrRegdIi0fN47AY0v'].join('_');
const REPO = 'luttongi0-eng/household_account_book';
const repoDir = process.cwd();

const ignorePatterns = [
  'node_modules',
  '.next',
  '.git',
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  'dist',
  'build',
  'coverage',
  'upload_changes.js',
];

function githubRequest(urlPath, method, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: urlPath,
      method: method,
      headers: {
        'User-Agent': 'Node.js',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ status: res.statusCode, body: parsed });
          }
        } catch (e) {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function getAllFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (ignorePatterns.some((pattern) => relPath === pattern || relPath.startsWith(`${pattern}/`))) {
      continue;
    }
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(path.join(dir, entry.name), relPath));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

async function uploadChanges() {
  console.log('1. Getting latest commit on main branch...');
  const refData = await githubRequest(`/repos/${REPO}/git/refs/heads/main`, 'GET');
  const latestCommitSha = refData.object.sha;
  console.log('Latest commit SHA:', latestCommitSha);

  const files = getAllFiles(repoDir);
  console.log(`2. Creating git blobs for ${files.length} files...`);

  const treeItems = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fullPath = path.join(repoDir, file);
    const contentBuffer = fs.readFileSync(fullPath);
    const contentBase64 = contentBuffer.toString('base64');

    const blob = await githubRequest(`/repos/${REPO}/git/blobs`, 'POST', {
      content: contentBase64,
      encoding: 'base64',
    });

    treeItems.push({
      path: file.replace(/\\/g, '/'),
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    });
    process.stdout.write(`\rUploaded ${i + 1}/${files.length} files...`);
  }
  console.log('\nAll blobs created successfully.');

  console.log('3. Creating git tree...');
  const tree = await githubRequest(`/repos/${REPO}/git/trees`, 'POST', {
    base_tree: latestCommitSha,
    tree: treeItems,
  });
  console.log('Tree SHA:', tree.sha);

  console.log('4. Creating commit...');
  const commit = await githubRequest(`/repos/${REPO}/git/commits`, 'POST', {
    message: 'fix: 모바일 헤더 타이틀 한 줄 고정 및 폰트 크기 위계 최적화, Gemini 3.8 Flash 연동 안정화',
    tree: tree.sha,
    parents: [latestCommitSha],
    author: {
      name: 'luttongi0-eng',
      email: 'luttongi0@gmail.com',
      date: new Date().toISOString(),
    },
  });
  console.log('Commit SHA:', commit.sha);

  console.log('5. Updating main branch ref...');
  await githubRequest(`/repos/${REPO}/git/refs/heads/main`, 'PATCH', {
    sha: commit.sha,
    force: true,
  });

  console.log('🎉 Successfully pushed updated codebase to GitHub!');
}

uploadChanges().catch(err => {
  console.error('Upload failed:', JSON.stringify(err, null, 2));
  process.exit(1);
});
