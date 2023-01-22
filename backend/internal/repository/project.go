package repository

import (
	"detectify/internal/model"
)

func AddProject(user *model.Project) error {
	return db.Create(&user).Error
}

func AddProjectCategory(category *model.ProjectCategory) error {
	return db.Create(&category).Error
}

func AddProjectImage(image *model.ProjectImage) error {
	return db.Create(&image).Error
}

func QueryProjectsWithCountsByUser(userID uint) ([]model.Project, error) {
	var projects []model.Project
	err := db.Table("projects").
		Select("projects.*, count(project_categories.id) as categories_count, count(project_images.id) as images_count").
		Joins("left join project_categories on project_categories.project_id = projects.id left join project_images on project_images.project_id = projects.id").
		Group("projects.id").
		Scan(&projects).
		Error
	return projects, err
}
