package repository

import (
	"detectify/internal/model"

	"github.com/google/uuid"
)

func AddUser(user *model.User) error {
	user.ID = uuid.NewString()
	return db.Create(&user).Error
}

func CheckUserEmail(email string) bool {
	var user model.User
	db.Select("id").Where("email = ?", email).First(&user)
	return user.ID != ""
}

func QueryUserByEmail(email string) (model.User, error) {
	var user model.User
	err := db.Limit(1).Where("email = ?", email).Find(&user).Error
	return user, err
}

func QueryUserByID(id string) (model.User, error) {
	var user model.User
	err := db.Limit(1).Where("id = ?", id).Find(&user).Error
	return user, err
}
