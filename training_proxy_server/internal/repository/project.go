package repository

import (
	"training-proxy-server/internal/model"
)

func UpdateProjectModelURL(userID string, projectID string, modelURL string) error {
	err := db.Model(&model.Project{}).
		Where("id = ? and user_id = ?", projectID, userID).
		Update("model_url", modelURL).Error
	return err
}
