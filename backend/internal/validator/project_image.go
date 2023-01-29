package validator

import (
	"detectify/internal/model"
	"path"
	"strings"
)

func CheckCreateBatchUpload(dataset []model.ProjectImage) bool {
	dataMap := make(map[string]model.ProjectImage)
	for _, item := range dataset {
		_, exists := dataMap[item.Filename]
		if exists ||
			!CheckImageExtenstion(item.ImageExt) ||
			!CheckAnnotationExtenstion(item.AnnotationExt) {
			return false
		}
		dataMap[item.Filename] = item
	}
	return true
}

func CheckImageExtenstion(ext string) bool {
	return ext == "" || ext == ".png" || ext == ".jpg" || ext == ".jpeg"
}

func CheckAnnotationExtenstion(ext string) bool {
	return ext == "" || ext == ".xml"
}

func getFileNameWithoutExtension(fileNameWithExt string) string {
	return strings.TrimSuffix(path.Base(fileNameWithExt), path.Ext(fileNameWithExt))
}
