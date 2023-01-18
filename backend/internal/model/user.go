package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name      string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	Email     string `gorm:"type:varchar(255) NOT NULL;" json:"email"`
	Password  string `gorm:"type:varchar(72) NOT NULL;" json:"password"`
	AvatarURL string `gorm:"type:varchar(255) NOT NULL;" json:"avatarURL"`
}
