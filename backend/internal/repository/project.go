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

type ProjectResponse struct {
	ID              int
	Name            string
	CategoriesCount int
	ImagesCount     int
}

func QueryProjectsWithCountsByUser(userID string) ([]ProjectResponse, error) {
	var projects []ProjectResponse
	err := db.Table("projects").
		Select(`projects.id,
				projects.name,
				count(project_categories.id) as categories_count,
				count(project_images.id) as images_count`).
		Joins(`left join project_categories on project_categories.project_id = projects.id
			   left join project_images on project_images.project_id = projects.id`).
		Group("projects.id").
		Scan(&projects).
		Error
	return projects, err
}
