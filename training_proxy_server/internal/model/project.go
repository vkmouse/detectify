package model

import (
	"gorm.io/gorm"
)

type Project struct {
	gorm.Model
	ID          string `gorm:"primarykey;type:varchar(36) not null;"`
	Name        string `gorm:"type:varchar(255) not null;" json:"name"`
	Description string `gorm:"type:varchar(255) not null;" json:"description"`
	Cover       string `gorm:"type:varchar(255) not null;" json:"cover"`
	ModelURL    string `gorm:"type:varchar(255) not null;" json:"modelURL"`
	UserID      string
}
