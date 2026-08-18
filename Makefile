.PHONY: all build serve test validate ssg clean

BINARY_NAME=wha

all: test build

build:
	@mkdir -p cmd/wha/data
	@cp data/*.json cmd/wha/data/
	go build -ldflags="-s -w" -o $(BINARY_NAME) ./cmd/wha

serve: build
	./$(BINARY_NAME) serve --port 8080

test:
	go test -v ./...

validate: build
	./$(BINARY_NAME) validate

ssg: build
	./$(BINARY_NAME) build --out dist

clean:
	rm -rf $(BINARY_NAME) dist output-md
