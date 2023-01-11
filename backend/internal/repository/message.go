package repository

import "detectify/internal/model"

func AddMessage(content string, imageURL string) {
	db.Create(&model.Message{Content: content, ImageURL: imageURL})
}

func QueryAllMessages() ([]model.Message, error) {
	messages := make([]model.Message, 0)
	err := db.Find(&messages).Error
	return messages, err
}
