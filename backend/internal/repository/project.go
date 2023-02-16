package repository

import (
	"detectify/config"
	"detectify/internal/model"

	"github.com/google/uuid"
)

func AddProject(project *model.Project) error {
	project.ID = uuid.NewString()
	project.ModelURL = config.R2AccessURL + "ssd320"
	return db.Create(&project).Error
}

func VerifyProjectAccess(userID string, projectID string) bool {
	var project model.Project
	err := db.
		Select("user_id, id").
		Where("user_id = ? AND id = ?", userID, projectID).
		First(&project).Error
	return err == nil && project.UserID == userID && project.ID == projectID
}

type ProjectResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	ImagesCount int    `json:"imagesCount"`
}

func QueryProjectsWithCountsByUser(userID string) ([]ProjectResponse, error) {
	projects := make([]ProjectResponse, 0)
	err := db.Table("projects").
		Select(`projects.id,
				projects.name,
				count(distinct project_images.id) as images_count`).
		Joins(`left join project_images on project_images.project_id = projects.id`).
		Where("projects.user_id = ?", userID).
		Group("projects.id").
		Order("projects.created_at desc").
		Scan(&projects).
		Error
	return projects, err
}

func QueryProject(userID string, projectID string) (model.Project, error) {
	var project model.Project
	err := db.
		Select("id, name, model_url").
		Where("user_id = ? AND id = ?", userID, projectID).
		First(&project).Error
	return project, err
}
