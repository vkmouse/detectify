package errmsg

import "net/http"

const (
	SUCCESS             = 200
	ERROR_INVALID_INPUT = 501

	ERROR_ACCOUNT_EXIST = 1001
)

type CodeMsg struct {
	Code    int
	Message string
}

var codeMsg = map[int]CodeMsg{
	SUCCESS: {
		Code:    http.StatusOK,
		Message: "Success",
	},

	ERROR_INVALID_INPUT: {
		Code:    http.StatusBadRequest,
		Message: "Error: Invalid input",
	},

	ERROR_ACCOUNT_EXIST: {
		Code:    http.StatusBadRequest,
		Message: "Error: Email already registered.",
	},
}

func GetErrMsg(code int) CodeMsg {
	return codeMsg[code]
}
