package day01

import (
	"fmt"
	"os"
	"strings"
)

func Day01() {
	content, _ := os.ReadFile("../data/day01.txt")
	lines := strings.Split(string(content), "\n")
	value1 := part1(lines)
	value2 := part2(lines)
	fmt.Println("===== Day 01 =====")
	fmt.Println("The sum of the calibration values is", value1)
	fmt.Println("The correct sum of the calibration values is", value2)
}

var shortNumerals = []string{
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
}

func part1(lines []string) int {
	sum := 0
	for _, line := range lines {
		sum += firstNum(line, shortNumerals)*10 + lastNum(line, shortNumerals)
	}
	return sum
}

var longNumerals = []string{
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	"zero", "one", "two", "three", "four", "five",
	"six", "seven", "eight", "nine",
}

func part2(lines []string) int {
	sum := 0
	for _, line := range lines {
		sum += firstNum(line, longNumerals)*10 + lastNum(line, longNumerals)
	}
	return sum
}

func firstNum(line string, numerals []string) int {
	leastIndex := 100000
	value := 0
	for i, num := range numerals {
		index := strings.Index(line, num)
		if index >= 0 && index < leastIndex {
			leastIndex = index
			value = i % 10
		}
	}
	return value
}

func lastNum(line string, numerals []string) int {
	largestIndex := -1
	value := 0
	for i, num := range numerals {
		index := strings.LastIndex(line, num)
		if index >= 0 && index > largestIndex {
			largestIndex = index
			value = i % 10
		}
	}
	return value
}
