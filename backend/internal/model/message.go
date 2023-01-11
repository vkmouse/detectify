package model

import "gorm.io/gorm"

type Message struct {
	gorm.Model
	Content  string `gorm:"type:varchar(100) NOT NULL;" json:"content"`
	ImageURL string `gorm:"type:varchar(100) NOT NULL;" json:"imageURL"`
}
