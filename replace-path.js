// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// Alias 맵 (실제 경로와 맞게 수정)
// 예: "~/src/services/shuttle-operation" -> "~shuttle-operation"
const aliasMap = {
  "~/src/services/counselings": "~counselings",
  "~/src/services/users": "~users",
  "~/src/shared": "~shared",
  "~/src/gen": "~proto",
};

// 변환 대상 파일 확장자
const targetExtensions = [".ts", ".tsx"];

// 폴더 재귀적으로 검색
function getFilesRecursively(directory) {
  const files = [];
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getFilesRecursively(fullPath));
    } else if (targetExtensions.includes(path.extname(fullPath))) {
      files.push(fullPath);
    }
  });
  return files;
}

// Import 경로 변환
function replaceImportPaths(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  let updatedContent = fileContent;
  let isUpdated = false;

  // 예:
  // import { Something } from "~/src/services/shuttle-operation/query/abc";
  // -------------------^prefix ^original-------------------^subPath
  // 정규식에서 세 부분을 캡처:
  // 1. import { ... } from "
  // 2. aliasMap의 키(original)
  // 3. 뒤에 이어지는 모든 경로(subPath)
  for (const [original, replacement] of Object.entries(aliasMap)) {
    // (import\s+.*?\s+from\s+["']) : "import ... from '"
    // original                      : alias 키 (~/src/services/shuttle-operation 등)
    // ([^"']*)                     : 그 뒤의 임의의 subPath(예: /query/abc)
    // ["']                         : 마무리 따옴표
    const regex = new RegExp(`(import\\s+.*?\\s+from\\s+["'])${original}([^"']*)["']`, "g");

    updatedContent = updatedContent.replace(regex, (match, prefix, subPath) => {
      isUpdated = true;
      return `${prefix}${replacement}${subPath}"`;
    });
  }

  if (isUpdated) {
    fs.writeFileSync(filePath, updatedContent, "utf-8");
    console.log(`Updated imports in: ${filePath}`);
  }
}

// 실행
const targetDirectory = path.join(__dirname, "src"); // 실제 대상 디렉토리
const files = getFilesRecursively(targetDirectory);

files.forEach((file) => replaceImportPaths(file));

console.log("Import path transformation complete.");
