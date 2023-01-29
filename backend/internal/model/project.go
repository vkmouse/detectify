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
	UserID      string
	User        User
}

type ProjectCategory struct {
	ID        string `gorm:"type:varchar(36) not null;"`
	Name      string `gorm:"primarykey;type:varchar(255) not null;" json:"name"`
	ProjectID string `gorm:"primarykey;" json:"projectId"`
	Project   Project
}
