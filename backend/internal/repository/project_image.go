package repository

import (
	"detectify/internal/model"

	"github.com/google/uuid"
	"gorm.io/gorm/clause"
)

func QueryProjectImageByFilename(images []string, annotations []string) ([]model.ProjectImage, error) {
	var projectImages []model.ProjectImage
	err := db.Table("project_images").
		Select("id, image, annotation").
		Where("image in (?) or annotation in(?)", images, annotations).
		Scan(&projectImages).Error
	return projectImages, err
}

func AddProjectImagesIfNotExisted(projectID string, images []model.ProjectImage) ([]model.ProjectImage, error) {
	filenames := make([]string, 0)
	for _, image := range images {
		filenames = append(filenames, image.Filename)
	}

	existingImages, err := QueryBatchProjectImageByFilename(projectID, filenames)
	if err != nil {
		return make([]model.ProjectImage, 0), err
	}

	existingImagesMap := make(map[string]model.ProjectImage)
	for _, item := range existingImages {
		existingImagesMap[item.Filename] = item
	}

	newImages := make([]model.ProjectImage, 0)
	for i := range images {
		image := &images[i]
		image.ProjectID = projectID
		if existingImage, ok := existingImagesMap[image.Filename]; !ok {
			image.ID = uuid.NewString()
		} else {
			image.ID = existingImage.ID
			if image.ImageExt == "" {
				image.ImageExt = existingImage.ImageExt
			}
			if image.AnnotationExt == "" {
				image.AnnotationExt = existingImage.AnnotationExt
			}
		}
		newImages = append(newImages, *image)
	}

	err = db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "filename"}, {Name: "project_id"}},
		DoUpdates: clause.AssignmentColumns([]string{"image_ext", "annotation_ext"}),
	}).CreateInBatches(&newImages, len(newImages)).Error
	return images, err
}

func QueryBatchProjectImageByFilename(projectID string, filenames []string) ([]model.ProjectImage, error) {
	var images []model.ProjectImage
	err := db.Where("project_id = ? and filename in (?)", projectID, filenames).
		Find(&images).
		Error
	return images, err
}

func QueryProjectImagesByProjectID(projectID string) ([]model.ProjectImage, error) {
	var projectImages []model.ProjectImage
	err := db.
		Where("project_id = ? and image_published = true and annotation_published = true", projectID).
		Find(&projectImages).Error
	return projectImages, err
}

func UpdateProjectImagePublishedByFilename(projectID string, images []model.ProjectImage) error {
	if len(images) > 0 {
		return db.Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "filename"}, {Name: "project_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"image_published", "annotation_published"}),
		}).Create(&images).Error
	}
	return nil
}
