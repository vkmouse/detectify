package repository

import (
	"detectify/internal/model"
	"fmt"
)

func CheckUserEmail(email string) bool {
	var user model.User
	result := db.Select("id").Where("email = ?", email).First(&user)
	fmt.Println(result.Error)
	return result.Error == nil
}

func AddUser(user *model.User) {
	db.Create(&user)
}
