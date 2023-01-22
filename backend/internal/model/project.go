package model

import (
	"gorm.io/gorm"
)

type Project struct {
	gorm.Model
	Name        string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	Description string `gorm:"type:varchar(255) NOT NULL;" json:"description"`
	UserID      string `gorm:"type:varchar(36) NOT NULL;"`
	Cover       string `gorm:"type:varchar(255) NOT NULL;" json:"cover"`
}

type ProjectCategory struct {
	gorm.Model
	Name      string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	ProjectID uint   `gorm:"NOT NULL;" json:"projectID"`
}

type ProjectImage struct {
	gorm.Model
	URL       string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	ProjectID uint   `gorm:"NOT NULL;" json:"projectID"`
}
