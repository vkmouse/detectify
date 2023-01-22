package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID       string `gorm:"primarykey type:varchar(36) NOT NULL;"`
	Name     string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	Email    string `gorm:"type:varchar(255) NOT NULL unique;" json:"email"`
	Password string `gorm:"type:varchar(72) NOT NULL;" json:"password"`
	Avatar   string `gorm:"type:varchar(255) NOT NULL;" json:"avatar"`
}
