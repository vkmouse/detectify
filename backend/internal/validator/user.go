package validator

import (
	"regexp"
)

const (
	emailRegex    = `^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$`
	nameRegex     = `^[^@#$%^&*() ]{1,20}$`
	passwordRegex = `^[.*a-zA-Z\d]{4,50}$`
)

func CheckEmail(value string) bool {
	match, _ := regexp.MatchString(emailRegex, value)
	return match
}

func CheckName(value string) bool {
	match, _ := regexp.MatchString(nameRegex, value)
	return match
}

func CheckPassword(value string) bool {
	match, _ := regexp.MatchString(passwordRegex, value)
	return match
}
