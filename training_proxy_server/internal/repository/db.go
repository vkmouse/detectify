package repository

import (
	"fmt"
	"time"
	"training-proxy-server/config"
	"training-proxy-server/internal/model"

	"gorm.io/driver/mysql"
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
	models := []interface{}{&model.Project{}}

	dns := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True",
		config.MySQLUser,
		config.MySQLPassword,
		config.MySQLHost,
		config.MySQLPort,
		config.MySQLName,
	)
	db, err = gorm.Open(mysql.Open(dns), &gorm.Config{})
	db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(models...)

	if err != nil {
		panic("failed to connect database")
	}

	sqlDb, _ := db.DB()

	sqlDb.SetConnMaxLifetime(time.Duration(MaxLifetime) * time.Second)
	sqlDb.SetMaxIdleConns(MaxIdleConns)
	sqlDb.SetMaxOpenConns(MaxOpenConns)
}
