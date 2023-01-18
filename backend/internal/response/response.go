package response

import (
	"detectify/internal/errmsg"

	"github.com/gin-gonic/gin"
)

func Response(ctx *gin.Context, status int) {
	codeMsg := errmsg.GetErrMsg(status)
	var context = gin.H{
		"status":  status,
		"message": codeMsg.Message,
	}
	ctx.JSON(
		codeMsg.Code,
		context,
	)
}
