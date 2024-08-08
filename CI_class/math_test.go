package main

import "testing"

func TestSum(t *testing.T) {
    total := sum(15, 15)

    if total != 30 {
        t.Errorf("Expected: %d; Got: %d", 30, total)
    }
}

func TestSub(t *testing.T) {
    total := sub(15, 15)

    if total != 0 {
        t.Errorf("Expected: %d; Got: %d", 0, total)
    }
}

func TestTimes(t *testing.T) {
    total := times(15, 2)

    if total != 30 {
        t.Errorf("Expected: %d; Got: %d", 30, total)
    }
}

func TestSquare(t *testing.T) {
    total := square(15)

    if total != 225 {
        t.Errorf("Expected: %d; Got: %d", 225, total)
    }
}