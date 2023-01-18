package response

import (
	"detectify/internal/errmsg"

	"github.com/gin-gonic/gin"
)

func Response(ctx *gin.Context, status int) {
	codeMsg := errmsg.GetErrMsg(status)
	context := gin.H{
		"status":  status,
		"message": codeMsg.Message,
	}
	ctx.JSON(
		codeMsg.Code,
		context,
	)
}

func ResponseWithData(ctx *gin.Context, status int, data gin.H) {
	codeMsg := errmsg.GetErrMsg(status)
	context := gin.H{
		"status":  status,
		"message": codeMsg.Message,
		"data":    data,
	}
	ctx.JSON(
		codeMsg.Code,
		context,
	)
}
