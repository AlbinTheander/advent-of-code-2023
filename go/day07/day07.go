package day07

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

type hand struct {
	cards string
	bid   int
	score int
}

func Day07() {
	data, _ := os.ReadFile("../data/day07.txt")
	// data, _ := os.ReadFile("./test.txt")
	hands := parseData(data)
	value1 := part1(hands)

	fmt.Println("\n===== Day 07 =====")
	fmt.Println("The total hand scoring is", value1)
}

func part1(hands []hand) int {
	sort.Slice(hands, func(i, j int) bool { return hands[i].score < hands[j].score })
	total := 0
	for i, h := range hands {
		total += h.bid * (i + 1)
	}
	return total
}

func parseData(data []byte) []hand {
	lines := strings.Split(string(data), "\n")
	hands := make([]hand, 0)
	for _, line := range lines {
		parts := strings.Split(line, " ")
		cards := parts[0]
		bid, _ := strconv.Atoi(parts[1])
		score := handScore(cards)*1e10 + baseScore(cards)
		hands = append(hands, hand{cards, bid, score})
	}
	return hands
}

func baseScore(line string) int {
	score := 0
	for _, c := range line {
		score *= 100
		switch c {
		case 'A':
			score += 14
		case 'K':
			score += 13
		case 'Q':
			score += 12
		case 'J':
			score += 11
		case 'T':
			score += 10
		default:
			score += int(c - '0')
		}
	}
	return score
}

func handScore(cards string) int {
	sortedCards := sortCharacters(cards)
	if isFiveOfAKind(sortedCards) {
		return 9
	} else if isFourOfAKind(sortedCards) {
		return 8
	} else if isFullHouse(sortedCards) {
		return 7
	} else if isThreeOfAKind(sortedCards) {
		return 6
	} else if isTwoPairs(sortedCards) {
		return 5
	} else if isPair(sortedCards) {
		return 4
	}
	return 1
}

func isFiveOfAKind(cards string) bool {
	return cards[0] == cards[4]
}

func isFourOfAKind(cards string) bool {
	return cards[0] == cards[3] || cards[1] == cards[4]
}

func isFullHouse(cards string) bool {
	return cards[0] == cards[2] && cards[3] == cards[4] || cards[0] == cards[1] && cards[2] == cards[4]
}

func isThreeOfAKind(cards string) bool {
	return cards[0] == cards[2] || cards[1] == cards[3] || cards[2] == cards[4]
}

func isTwoPairs(cards string) bool {
	return cards[0] == cards[1] && cards[2] == cards[3] ||
		cards[0] == cards[1] && cards[3] == cards[4] ||
		cards[1] == cards[2] && cards[3] == cards[4]
}

func isPair(cards string) bool {
	return cards[0] == cards[1] || cards[1] == cards[2] || cards[2] == cards[3] || cards[3] == cards[4]
}

func sortCharacters(s string) string {
	runes := []rune(s)
	sort.Slice(runes, func(i, j int) bool { return runes[i] < runes[j] })
	return string(runes)
}
