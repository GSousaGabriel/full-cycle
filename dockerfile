FROM golang:1.19

WORKDIR /app

COPY ./go.mod .
COPY ./CI_class .

RUN go build -o math

CMD ["./math"]