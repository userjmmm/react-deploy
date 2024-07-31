const fs = require('fs');
const path = require('path');

// depcheck 결과 읽기
const depcheckResult = JSON.parse(fs.readFileSync('depcheck-result.json', 'utf-8'));
const missingDeps = depcheckResult.missing;

// 현재 package.json 읽기
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// 누락된 의존성 추가
Object.keys(missingDeps).forEach(dep => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    // 적절한 버전 범위 설정 필요
    packageJson.dependencies[dep] = '*';
  }
});

// 업데이트된 package.json 저장
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');

console.log('package.json has been updated with missing dependencies.');
