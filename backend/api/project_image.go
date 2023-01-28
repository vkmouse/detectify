package api

import (
	"detectify/config"
	"detectify/internal/errmsg"
	"detectify/internal/model"
	"detectify/internal/repository"
	"detectify/internal/response"
	"detectify/internal/validator"
	"detectify/pkg/r2"

	"github.com/gin-gonic/gin"
)

type BatchUploadData struct {
	ProjectID     string
	UploadedFiles []model.ProjectImage
}

type BatchPublishData struct {
	ProjectID    string
	PublishFiles []string
}

type BatchUploadResult struct {
	Filename      string `json:"filename"`
	ImageURL      string `json:"imageURL"`
	AnnotationURL string `json:"annotationURL"`
}

func CreateBatchUpload(ctx *gin.Context) {
	var dataset BatchUploadData
	err := ctx.BindJSON(&dataset)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	userID := ctx.GetString("userID")
	if !repository.VerifyProjectAccess(userID, dataset.ProjectID) {
		response.Response(ctx, errmsg.ERROR_FORBIDDEN)
		return
	}

	if !validator.CheckCreateBatchUpload(dataset.UploadedFiles) {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	items, err := repository.AddProjectImagesIfNotExisted(dataset.ProjectID, dataset.UploadedFiles)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	dataMap := make(map[string]model.ProjectImage)
	for _, item := range items {
		dataMap[item.Filename] = item
	}

	var results []BatchUploadResult
	for _, data := range dataMap {
		result := BatchUploadResult{
			Filename:      data.Filename,
			ImageURL:      "",
			AnnotationURL: "",
		}
		if data.ImageExt != "" {
			result.ImageURL = r2.GeneratingPresignedURL(data.ID + data.ImageExt)
		}
		if data.AnnotationExt != "" {
			result.AnnotationURL = r2.GeneratingPresignedURL(data.ID + data.AnnotationExt)
		}
		results = append(results, result)
	}

	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{"data": results})
}

func PublishBatchUpload(ctx *gin.Context) {
	var dataset BatchPublishData
	err := ctx.BindJSON(&dataset)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	userID := ctx.GetString("userID")
	if !repository.VerifyProjectAccess(userID, dataset.ProjectID) {
		response.Response(ctx, errmsg.ERROR_FORBIDDEN)
		return
	}

	bucketItems, err := r2.ListBucketItems()
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	imagesFromDb, err := repository.QueryBatchProjectImageByFilename(dataset.ProjectID, dataset.PublishFiles)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	images := make([]model.ProjectImage, 0)
	for _, item := range imagesFromDb {
		image := model.ProjectImage{
			Filename:  item.Filename,
			ProjectID: dataset.ProjectID,
		}

		_, image.ImagePublished = bucketItems[item.ID+item.ImageExt]
		_, image.AnnotationPublished = bucketItems[item.ID+item.AnnotationExt]
		images = append(images, image)
	}

	err = repository.UpdateProjectImagePublishedByFilename(dataset.ProjectID, images)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	response.Response(ctx, errmsg.SUCCESS)
}

func GetProjectImages(ctx *gin.Context) {
	var v struct {
		ProjectID string
	}
	err := ctx.BindJSON(&v)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	userID := ctx.GetString("userID")
	if !repository.VerifyProjectAccess(userID, v.ProjectID) {
		response.Response(ctx, errmsg.ERROR_FORBIDDEN)
		return
	}

	images, err := repository.QueryProjectImagesByProjectID(v.ProjectID)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	results := make([]BatchUploadResult, 0)
	for _, image := range images {
		results = append(results, BatchUploadResult{
			Filename:      image.Filename,
			ImageURL:      config.R2AccessURL + image.ID + image.ImageExt,
			AnnotationURL: config.R2AccessURL + image.ID + image.AnnotationExt,
		})
	}

	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{"data": results})
}
