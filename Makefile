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
	$(BUF) generate
	@echo "[LOG] Protocol Buffers build completed!"

clean:
	@echo "[LOG] Cleaning generated files..."
	rm -rf $(GEN_DIR)/*
	@echo "[LOG] Clean completed!"


pull:
	@echo "[LOG] Fetching Protocol Buffers..."
	git submodule foreach git pull origin main
