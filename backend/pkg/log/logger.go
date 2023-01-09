package log

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func InitLogger() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.TraceLevel)

	file, err := os.OpenFile("detectify.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err == nil {
		log.SetOutput(file)
	} else {
		log.Info("Failed to log to file, using default stderr")
	}
}

func GinLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		duration := time.Since(start)
		var cost string
		if duration >= time.Second {
			cost = fmt.Sprintf("%f s", duration.Seconds())
		} else if duration >= time.Millisecond {
			cost = fmt.Sprintf("%d ms", duration.Milliseconds())
		} else {
			cost = fmt.Sprintf("%d µs", duration.Microseconds())
		}

		log.WithFields(log.Fields{
			"status":     c.Writer.Status(),
			"method":     c.Request.Method,
			"query":      query,
			"ip":         c.ClientIP(),
			"user-agent": c.Request.UserAgent(),
			"errors":     c.Errors.ByType(gin.ErrorTypePrivate).String(),
			"cost":       cost,
		}).Info(path)
	}
}

func Fatal(args ...interface{}) {
	log.Fatal(args)
}
