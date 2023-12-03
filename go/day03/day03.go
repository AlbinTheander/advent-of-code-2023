package day03

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func Day03() {
	content, _ := os.ReadFile("../data/day03.txt")
	result1 := part1(string(content))
	result2 := part2(string(content))

	fmt.Println("\n===== Day 03 =====")
	fmt.Println("The sum of the part numbers is", result1)
	fmt.Println("The sum of the gear powers is", result2)
}

func part1(data string) int {
	lines := strings.Split(data, "\n")

	currentNumber := ""
	sum := 0

	for y := 0; y < len(lines); y++ {
		for x := 0; x <= len(lines[y]); x++ {
			if x >= 0 && x < len(lines[y]) && lines[y][x] >= '0' && lines[y][x] <= '9' {
				currentNumber += string(lines[y][x])
			} else if currentNumber != "" {
				// Ok, we have a number, now let's check if there's a symbol
				// around it
				num, _ := strconv.Atoi(currentNumber)
				for x1 := x - len(currentNumber) - 1; x1 <= x; x1++ {
					for y1 := y - 1; y1 <= y+1; y1++ {
						if x1 >= 0 && y1 >= 0 && x1 < len(lines[y]) && y1 < len(lines) && !strings.Contains(".0123456789", string(lines[y1][x1])) {
							// We found a symbol, let's add the number to the sum, and reset it so it won't be added again
							sum += num
							num = 0
						}
					}
				}
				currentNumber = ""
			}
		}
	}
	return sum
}

type Pos struct {
	x, y int
}

func part2(data string) int {
	lines := strings.Split(data, "\n")

	currentNumber := ""
	possibleGears := make(map[Pos]([]int))

	for y := 0; y < len(lines); y++ {
		for x := 0; x <= len(lines[y]); x++ {
			if x >= 0 && x < len(lines[y]) && lines[y][x] >= '0' && lines[y][x] <= '9' {
				currentNumber += string(lines[y][x])
			} else if currentNumber != "" {
				// Ok, we have a number, now let's check if there's a gear
				// around it and at add it to the gear list
				num, _ := strconv.Atoi(currentNumber)
				for x1 := x - len(currentNumber) - 1; x1 <= x; x1++ {
					for y1 := y - 1; y1 <= y+1; y1++ {
						if x1 >= 0 && y1 >= 0 && x1 < len(lines[y]) && y1 < len(lines) && lines[y1][x1] == '*' {
							gear, exists := possibleGears[Pos{x1, y1}]
							if !exists {
								gear = make([]int, 0)
							}
							gear = append(gear, num)
							possibleGears[Pos{x1, y1}] = gear
						}
					}
				}
				currentNumber = ""
			}
		}
	}

	// Now we have a list of possible gears. Let's find the real ones and
	// add their powers together
	sum := 0
	for _, gear := range possibleGears {
		if len(gear) == 2 { // It's a real gear if it's close to two numbers
			sum += gear[0] * gear[1]
		}
	}

	return sum
}
