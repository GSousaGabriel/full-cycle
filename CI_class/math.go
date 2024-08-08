package main

import "fmt"

func main() {
    fmt.Println(sum(10, 10))
}

func sum(a int, b int) int {
    return a + b
}

func sub(a int, b int) int {
    return a - b
}

func times(a int, b int) int {
    return a * b
}

func square(a int) int {
    return a*a
}