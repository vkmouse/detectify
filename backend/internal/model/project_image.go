package model

type ProjectImage struct {
	ID                  string `gorm:"type:varchar(36) not null;"`
	Filename            string `gorm:"primarykey;type:varchar(255) not null;" json:"filename"`
	ImageExt            string `gorm:"type:varchar(255) not null;" json:"imageExt"`
	AnnotationExt       string `gorm:"type:varchar(255) not null;" json:"annotationExt"`
	ImagePublished      bool   `gorm:"type:tinyint not null;"`
	AnnotationPublished bool   `gorm:"type:tinyint not null;"`
	ProjectID           string `gorm:"primarykey;type:varchar(36);"`
}
