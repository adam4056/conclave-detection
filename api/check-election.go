package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
)

// RSS feed structs
type RSS struct {
	Channel Channel `xml:"channel"`
}

type Channel struct {
	Items []Item `xml:"item"`
}

type Item struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	PubDate     string `xml:"pubDate"`
}

// Output JSON structure
type Result struct {
	PopeElected bool     `json:"popeElected"`
	Articles    []Article `json:"articles"`
}

type Article struct {
	Title   string `json:"title"`
	Link    string `json:"link"`
	PubDate string `json:"pubDate"`
}

func main() {
	http.HandleFunc("/api/check-election", handleCheckElection)
	log.Println("Server running on http://localhost:3000")
	http.ListenAndServe(":3000", nil)
}

func handleCheckElection(w http.ResponseWriter, r *http.Request) {
	url := "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114"
	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch RSS", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var rss RSS
	if err := xml.NewDecoder(resp.Body).Decode(&rss); err != nil {
		http.Error(w, "Failed to parse RSS", http.StatusInternalServerError)
		return
	}

	keywords := []string{
		"pope elected",
		"new pope",
		"white smoke",
		"new pontiff",
		"habemus papam",
		"papal conclave",
		"vatican elects",
		"successor to francis",
		"new vatican leader",
		"conclave selects pope",
		"st. peter's square",
		"new head of catholic church",
	}

	twoDaysAgo := time.Now().Add(-48 * time.Hour)
	var matches []Article

	for _, item := range rss.Channel.Items {
		pubTime, err := time.Parse(time.RFC1123Z, item.PubDate)
		if err != nil {
			pubTime, err = time.Parse(time.RFC1123, item.PubDate) // fallback
			if err != nil {
				continue
			}
		}
		if pubTime.Before(twoDaysAgo) {
			continue
		}

		title := strings.ToLower(item.Title)
		desc := strings.ToLower(item.Description)
		for _, kw := range keywords {
			if strings.Contains(title, kw) || strings.Contains(desc, kw) {
				matches = append(matches, Article{
					Title:   item.Title,
					Link:    item.Link,
					PubDate: item.PubDate,
				})
				break
			}
		}
	}

	result := Result{
		PopeElected: len(matches) > 0,
		Articles:    matches,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
