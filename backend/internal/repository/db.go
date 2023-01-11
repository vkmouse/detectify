package repository

import (
	"detectify/config"
	"detectify/internal/model"
	"fmt"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const (
	MaxLifetime  int = 10
	MaxOpenConns int = 10
	MaxIdleConns int = 10
)

var db *gorm.DB

func InitDbContext() {
	var err error
	dns := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True",
		config.DbUser,
		config.DbPassword,
		config.DbHost,
		config.DbPort,
		config.DbName,
	)

	if config.Mode == "Development" {
		db, err = gorm.Open(sqlite.Open(""), &gorm.Config{})
		db.Debug().AutoMigrate(&model.Message{})
	} else if config.Mode == "Production" {
		db, err = gorm.Open(mysql.Open(dns), &gorm.Config{})
		db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(&model.Message{})
	}

	if err != nil {
		panic("failed to connect database")
	}

	sqlDb, _ := db.DB()

	sqlDb.SetConnMaxLifetime(time.Duration(MaxLifetime) * time.Second)
	sqlDb.SetMaxIdleConns(MaxIdleConns)
	sqlDb.SetMaxOpenConns(MaxOpenConns)
}
