package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

var startedAt = time.Now()

func main() {
	http.HandleFunc("/healthz", Healthz)
	http.HandleFunc("/secret", Secret)
	http.HandleFunc("/configmap", ConfigMap)
	http.HandleFunc("/", Hello)
	http.ListenAndServe(":8000", nil)
}

func Hello(w http.ResponseWriter, r *http.Request) {
	name := os.Getenv("NAME")
	age := os.Getenv("AGE")

	fmt.Fprintf(w, "Hello, I'm %s. I'm %s.", name, age)

	w.Write([]byte("<br/><h1>hello Full Cycle 2421</h1>"))
}

func ConfigMap(w http.ResponseWriter, r *http.Request) {
	data, err := os.ReadFile("myfamily/family.txt")

	if err != nil {
		log.Fatalf("Error reading file: ", err)
	}

	fmt.Fprintf(w, "My family: %s", string(data))
}

func Secret(w http.ResponseWriter, r *http.Request) {
	user := os.Getenv("USER")
	pass := os.Getenv("PASS")

	fmt.Fprintf(w, "User: %s; Pass: %s.", user, pass)
}

func Healthz(w http.ResponseWriter, r *http.Request) {
	duration := time.Since(startedAt)

	for i := 0; i < 1000; i++ {
	}

	if duration.Seconds() < 10 {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprintf("Duration: %v", duration.Seconds())))
	} else {
		w.WriteHeader(200)
		w.Write([]byte("Ok!"))
	}
}
