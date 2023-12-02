package day02

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func Day02() {
	content, _ := os.ReadFile("../data/day02.txt")
	lines := strings.Split(string(content), "\n")
	value1 := part1(lines)
	value2 := part2(lines)
	fmt.Println("===== Day 02 =====")
	fmt.Println("The sum of the possible game ids is", value1)
	fmt.Println("The total power of the games is", value2)
}

func part1(lines []string) int {
	sum := 0
	for _, line := range lines {
		id := getGameId(line)
		if isPossible(line) {
			sum += id
		}
	}
	return sum
}

func part2(lines []string) int {
	sum := 0
	for _, line := range lines {
		sum += gamePower(line)
	}
	return sum
}

func getGameId(line string) int {
	gameIdRegex := regexp.MustCompile(`Game (\d+):`)
	matches := gameIdRegex.FindStringSubmatch(line)
	id, _ := strconv.Atoi(matches[1])
	return id
}

func isPossible(line string) bool {
	cubeRegex := regexp.MustCompile(`(\d+) (\w+)`)
	matches := cubeRegex.FindAllStringSubmatch(line, -1)
	for _, match := range matches {
		count, _ := strconv.Atoi(match[1])
		colour := match[2]
		switch colour {
		case "red":
			if count > 12 {
				return false
			}
		case "green":
			if count > 13 {
				return false
			}
		case "blue":
			if count > 14 {
				return false
			}
		}
	}
	return true
}

func gamePower(line string) int {
	cubeRegex := regexp.MustCompile(`(\d+) (\w+)`)
	matches := cubeRegex.FindAllStringSubmatch(line, -1)
	maxRed := 0
	maxGreen := 0
	maxBlue := 0
	for _, match := range matches {
		count, _ := strconv.Atoi(match[1])
		colour := match[2]
		switch colour {
		case "red":
			maxRed = max(maxRed, count)
		case "green":
			maxGreen = max(maxGreen, count)
		case "blue":
			maxBlue = max(maxBlue, count)
		}
	}
	return maxRed * maxGreen * maxBlue
}
