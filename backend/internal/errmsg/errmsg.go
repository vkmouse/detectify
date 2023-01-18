package errmsg

import "net/http"

const (
	SUCCESS             = 200
	ERROR_INVALID_INPUT = 400
	ERROR               = 500

	ERROR_EMAIL_EXIST     = 1001
	ERROR_EMAIL_NOT_EXIST = 1002
	ERROR_PASSWORD_ERROR  = 1003
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

	ERROR: {
		Code:    http.StatusInternalServerError,
		Message: "Error: Internal server error.",
	},

	ERROR_EMAIL_EXIST: {
		Code:    http.StatusBadRequest,
		Message: "Error: Email already registered.",
	},

	ERROR_EMAIL_NOT_EXIST: {
		Code:    http.StatusBadRequest,
		Message: "Error: Email not found.",
	},

	ERROR_PASSWORD_ERROR: {
		Code:    http.StatusBadRequest,
		Message: "Error: Incorrect password.",
	},
}

func GetErrMsg(code int) CodeMsg {
	return codeMsg[code]
}
