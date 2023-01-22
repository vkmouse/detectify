package model

import "gorm.io/gorm"

type Project struct {
	gorm.Model
	Name        string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	Description string `gorm:"type:varchar(255) default:'';" json:"description"`
	UserID      uint   `gorm:"NOT NULL;" json:"userID"`
	CoverURL    string `gorm:"type:varchar(255) default:'';" json:"coverURL"`
}

type ProjectCategory struct {
	gorm.Model
	Name      string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	ProjectID uint   `gorm:"NOT NULL;" json:"projectID"`
}

type ProjectImage struct {
	gorm.Model
	URL       string `gorm:"type:varchar(255) NOT NULL;" json:"name"`
	ProjectID int64  `gorm:"NOT NULL;" json:"projectID"`
}
