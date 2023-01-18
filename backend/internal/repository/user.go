package repository

import (
	"detectify/internal/model"
)

func AddUser(user *model.User) error {
	return db.Create(&user).Error
}

func CheckUserEmail(email string) bool {
	var user model.User
	db.Select("id").Where("email = ?", email).First(&user)
	return user.ID > 0
}

func QueryUserByEmail(email string) (model.User, error) {
	var user model.User
	err := db.Limit(1).Where("email = ?", email).Find(&user).Error
	return user, err
}
