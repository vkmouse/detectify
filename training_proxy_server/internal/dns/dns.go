package dns

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"training-proxy-server/config"
)

type DNSRecord struct {
	Type    string `json:"type"`
	Name    string `json:"name"`
	Content string `json:"content"`
	Proxied bool   `json:"proxied"`
}

type ListDNSResponse struct {
	Result []struct {
		Name string `json:"name"`
	} `json:"result"`
}

func CreateDNSRecord(name string) error {
	record := DNSRecord{
		Type:    "A",
		Name:    name,
		Content: config.DNSContent,
		Proxied: true,
	}

	recordBytes, err := json.Marshal(record)
	if err != nil {
		log.Println(err)
		return err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("https://api.cloudflare.com/client/v4/zones/%s/dns_records", config.DNSZoneID), bytes.NewBuffer(recordBytes))
	if err != nil {
		log.Println(err)
		return err
	}

	req.Header.Add("X-Auth-Email", config.DNSEmail)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", config.DNSAPIKey))
	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := ioutil.ReadAll(resp.Body)
		return fmt.Errorf("unexpected status code: %d\n%s", resp.StatusCode, string(body))
	}

	return nil
}

func ListDNSRecord() ([]string, error) {
	client := &http.Client{}
	names := make([]string, 0)

	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.cloudflare.com/client/v4/zones/%s/dns_records", config.DNSZoneID), nil)
	if err != nil {
		fmt.Println(err)
		return names, nil
	}

	req.Header.Add("X-Auth-Email", config.DNSEmail)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", config.DNSAPIKey))
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return names, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return names, err
	}

	var result ListDNSResponse
	_ = json.Unmarshal(body, &result)

	for _, resp := range result.Result {
		names = append(names, resp.Name)
	}

	return names, nil
}
