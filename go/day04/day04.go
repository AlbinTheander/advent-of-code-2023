package day04

import (
	"fmt"
	"os"
	"regexp"
	"slices"
	"strconv"
	"strings"
)

type Ticket struct {
	wins   []int
	mine   []int
	amount int
}

func Day04() {
	data, _ := os.ReadFile("../data/day04.txt")
	// data, _ := os.ReadFile("./test.txt")
	tickets := parseTickets(string(data))

	points := part1(tickets)
	totalAmount := part2(tickets)

	fmt.Println("\n===== Day 04 =====")
	fmt.Println("The total points are", points)
	fmt.Println("The total number of tickets is", totalAmount)
}

func part1(tickets []Ticket) int {
	points := 0
	for _, ticket := range tickets {
		score := 0
		for _, num := range ticket.mine {
			if slices.Contains(ticket.wins, num) {
				if score == 0 {
					score = 1
				} else {
					score *= 2
				}
			}
		}
		points += score
	}
	return points
}

func part2(tickets []Ticket) int {
	count := 0
	for i, ticket := range tickets {
		count += ticket.amount
		hits := 0
		for _, num := range ticket.mine {
			if slices.Contains(ticket.wins, num) {
				hits++
			}
		}
		for j := 1; j <= hits && j < len(tickets); j++ {
			tickets[i+j].amount += ticket.amount
		}
	}
	return count
}

func parseTickets(data string) []Ticket {
	tickets := make([]Ticket, 0)
	lines := strings.Split(data, "\n")
	for _, line := range lines {
		wins := getNumbers(strings.Split(strings.Split(line, ":")[1], "|")[0])
		mine := getNumbers(strings.Split(strings.Split(line, ":")[1], "|")[1])
		tickets = append(tickets, Ticket{wins, mine, 1})
	}
	return tickets
}

func getNumbers(s string) []int {
	numsRegex := regexp.MustCompile(`\d+`)
	numStrings := numsRegex.FindAllString(s, -1)
	nums := make([]int, 0)
	for _, numString := range numStrings {
		num, _ := strconv.Atoi(numString)
		nums = append(nums, num)
	}
	return nums
}
