package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID       string `gorm:"primarykey;type:varchar(36) not null;"`
	Name     string `gorm:"type:varchar(255) not null;" json:"name"`
	Email    string `gorm:"type:varchar(255) not null unique;" json:"email"`
	Password string `gorm:"type:varchar(72) not null;" json:"password"`
	Avatar   string `gorm:"type:varchar(255) not null;" json:"avatar"`
}
