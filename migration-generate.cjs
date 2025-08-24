/* eslint-disable */
const { execSync } = require("child_process");
const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs"); // 파일 시스템 모듈 추가
const path = require("path"); // 경로 모듈 추가

// 보기 편한 로그를 위한 헬퍼 객체
const log = {
  info: (text) => console.log(chalk.blue(text)),
  success: (text) => console.log(chalk.green(text)),
  error: (text) => console.log(chalk.red(text)),
  question: (text) => chalk.yellow(text),
  warning: (text) => console.log(chalk.yellowBright(text)),
};

// readline 인터페이스 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * TypeORM 마이그레이션 관련 명령어를 실행하는 범용 함수
 */
function runYarnScript(script) {
  try {
    log.info(`\n🚀 ${script} 명령어를 실행합니다...`);
    execSync(`yarn ${script}`, { stdio: "inherit" });
    log.success(`\n✅ ${script} 작업이 성공적으로 완료되었습니다.`);
  } catch (error) {
    log.error(`\n🚨 ${script} 작업 중 오류가 발생했습니다.`);
  }
}

// 1. 마이그레이션 생성 및 린팅 핸들러
function handleGenerate() {
  rl.question(log.question("\n📝 생성할 마이그레이션 파일명을 입력하세요 (예: users/create-user): "), (answer) => {
    const migrationName = answer ? answer.trim().replace(/[/\\s]/g, "-") : "";
    if (!migrationName) {
      log.error("❌ 파일명이 비어있습니다. 메인 메뉴로 돌아갑니다.");
      mainMenu();
      return;
    }

    const generationCommand = `yarn typeorm migration:generate src/migrations/${migrationName}`;
    const migrationDir = path.join(process.cwd(), "src", "migrations");

    try {
      log.info(`\n🚀 마이그레이션을 생성합니다: ${migrationName}`);
      execSync(generationCommand, { stdio: "inherit" });
      log.success(`\n✅ 마이그레이션 파일 생성이 요청되었습니다.`);

      // --- 가장 확실한 방법: 폴더를 직접 읽어 최신 파일 찾기 ---
      const files = fs.readdirSync(migrationDir);
      const latestFile = files
        .filter((file) => file.endsWith(".ts"))
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(migrationDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time)[0];

      if (!latestFile) throw new Error("생성된 마이그레이션 파일을 찾을 수 없습니다.");

      const latestFilePath = path.join("src", "migrations", latestFile.name); // 상대 경로로 재구성
      log.info(`✅ 생성된 파일: ${latestFile.name}`);
    } catch (error) {
      log.error("\n🚨 마이그레이션 생성에 실패했습니다.");
    }
    mainMenu();
  });
}

// 2. 마이그레이션 실행 핸들러
function handleRun() {
  runYarnScript("migration:run");
  mainMenu();
}

// 3. 마이그레이션 되돌리기 핸들러
function handleRevert() {
  runYarnScript("migration:revert");
  mainMenu();
}

// 메인 메뉴 함수
function mainMenu() {
  console.log("\n-------------------------------------------");
  log.info("  ✨ TypeORM 마이그레이션 헬퍼 ✨");
  console.log("-------------------------------------------\n");
  console.log("  1. 마이그레이션 파일 생성 (Generate)");
  console.log("  2. 마이그레이션 실행 (Run)");
  console.log("  3. 마이그레이션 되돌리기 (Revert)");
  console.log(chalk.red("  4. 종료 (Quit)"));
  console.log("");

  rl.question(log.question("실행할 작업 번호를 입력하세요: "), (choice) => {
    switch (choice.trim()) {
      case "1":
        handleGenerate();
        break;
      case "2":
        handleRun();
        break;
      case "3":
        handleRevert();
        break;
      case "4":
        log.info("\n👋 작업을 종료합니다.");
        rl.close();
        break;
      default:
        log.error("\n❌ 잘못된 번호입니다. 다시 입력해주세요.");
        mainMenu();
        break;
    }
  });
}

// 스크립트 시작
mainMenu();
