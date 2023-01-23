package repository

import (
	"detectify/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm/clause"
)

func AddProject(project *model.Project) error {
	project.ID = uuid.NewString()
	return db.Create(&project).Error
}

func AddProjectCategory(category *model.ProjectCategory) (bool, error) {
	result := db.Clauses(
		clause.OnConflict{DoNothing: true},
	).Create(&category)

	return result.RowsAffected > 0, result.Error
}

func AddProjectImage(image *model.ProjectImage) (bool, error) {
	result := db.Clauses(
		clause.OnConflict{DoNothing: true},
	).Create(&image)

	return result.RowsAffected > 0, result.Error
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
	ID              string
	Name            string
	CategoriesCount int
	ImagesCount     int
}

func QueryProjectsWithCountsByUser(userID string) ([]ProjectResponse, error) {
	projects := make([]ProjectResponse, 0)
	err := db.Table("projects").
		Select(`projects.id,
				projects.name,
				count(project_categories.project_id) as categories_count,
				count(project_images.project_id) as images_count`).
		Joins(`left join project_categories on project_categories.project_id = projects.id
			   left join project_images on project_images.project_id = projects.id`).
		Group("projects.id").
		Scan(&projects).
		Error
	return projects, err
}
