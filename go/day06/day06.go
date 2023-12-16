package day06

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func Day06() {
	data, _ := os.ReadFile("../data/day06.txt")
	raceLengths, records := parseData(data)
	value1 := part1(raceLengths, records)
	value2 := part2(data)

	fmt.Println("\n===== Day 06 =====")
	fmt.Println("The product of the ways of winning races is", value1)
	fmt.Println("The number of wins in the great race is", value2)
}

func part1(raceLengths []int, records []int) int {
	total := 1
	for i, raceLength := range raceLengths {
		record := records[i]
		wins := getWins(raceLength, record)
		total *= wins
	}
	return total
}

func part2(data []byte) int {
	numsRegEx := regexp.MustCompile(`\d+`)
	lines := strings.Split(string(data), "\n")
	raceLengthStrings := numsRegEx.FindAllString(lines[0], -1)
	recordStrings := numsRegEx.FindAllString(lines[1], -1)
	raceLengthString := ""
	recordString := ""
	for i, s := range raceLengthStrings {
		raceLengthString += s
		recordString += recordStrings[i]
	}

	raceLength, _ := strconv.Atoi(raceLengthString)
	record, _ := strconv.Atoi(recordString)

	return getWins(raceLength, record)
}

func getWins(raceLength int, record int) int {
	wins := 0
	for t := 0; t < raceLength; t++ {
		distance := (raceLength - t) * t
		if distance > record {
			wins++
		}
	}
	return wins
}

func parseData(data []byte) ([]int, []int) {
	numsRegEx := regexp.MustCompile(`\d+`)
	lines := strings.Split(string(data), "\n")
	raceLengthStrings := numsRegEx.FindAllString(lines[0], -1)
	recordStrings := numsRegEx.FindAllString(lines[1], -1)
	raceLengths := make([]int, len(raceLengthStrings))
	records := make([]int, len(recordStrings))
	for i, s := range raceLengthStrings {
		raceLengths[i], _ = strconv.Atoi(s)
		records[i], _ = strconv.Atoi(recordStrings[i])
	}

	return raceLengths, records
}
