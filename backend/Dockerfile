# Gunakan image Go resmi
FROM golang:1.24-alpine

# Set folder kerja di dalam container
WORKDIR /app

# Copy file go.mod dan go.sum
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Copy semua kode source
COPY . .

# Build aplikasi
RUN go mod tidy
RUN go build -o main .

# Ekspos port 7860 (Standar Hugging Face)
EXPOSE 7860

# Jalankan aplikasi
CMD ["./main"]
