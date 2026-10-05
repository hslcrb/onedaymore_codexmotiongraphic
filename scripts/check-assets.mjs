import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const names = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const large = names.filter(name => statSync(name).size >= 20 * 1024 * 1024);
if (large.length) {
  console.error('20MB 이상 원본은 DAT 분할 후 커밋해야 합니다:', large);
  process.exitCode = 1;
} else {
  console.log(`추적 파일 ${names.length}개 검사 완료: 20MB 이상 원본 없음.`);
}
