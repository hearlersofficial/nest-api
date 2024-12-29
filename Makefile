.PHONY: build clean

# 기본 디렉토리 설정
PROTO_DIR=src/proto
GEN_DIR=src/gen

# buf 명령어
BUF=buf

build:
	@echo "[LOG] Fetching Protocol Buffers..."
	git submodule foreach git pull origin main
	@echo "[LOG] Building Protocol Buffers..."
	cd $(PROTO_DIR) && $(BUF) generate --template=buf.gen.ts.yaml
	@echo "[LOG] Protocol Buffers build completed!"

commit:
	@echo "[LOG] Adding all changes to Git..."
	cd $(PROTO_DIR) && git add .
	@read -p "[INPUT] Commit message: " msg && cd $(PROTO_DIR) && git commit -m "$$msg"
	@echo "[LOG] Commit completed!"


push:
	@echo "[LOG] Pushing changes to remote..."
	cd $(PROTO_DIR) && git push origin $(shell git rev-parse --abbrev-ref HEAD)
	@echo "[LOG] Push completed!"


clean:
	@echo "[LOG] Cleaning generated files..."
	rm -rf $(GEN_DIR)/*
	@echo "[LOG] Clean completed!"

# 빌드 후 타입스크립트 파일 생성 확인
check:
	@echo "[LOG] Checking generated files..."
	@ls -la $(GEN_DIR)/com

pull:
	@echo "[LOG] Fetching Protocol Buffers..."
	git submodule foreach git pull origin main
