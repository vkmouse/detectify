package errmsg

const (
	SUCCESS             = 200
	ERROR_INVALID_INPUT = 400
	ERROR               = 500

	ACCESS_TOKEN_NOT_FOUND    = 600
	ACCESS_TOKEN_EXPIRED      = 601
	ACCESS_TOKEN_INVALID      = 602
	ACCESS_TOKEN_FORMAT_ERROR = 603

	REFRESH_TOKEN_NOT_FOUND = 700
	REFRESH_TOKEN_EXPIRED   = 701
	REFRESH_TOKEN_INVALID   = 702

	ERROR_EMAIL_EXIST     = 1001
	ERROR_EMAIL_NOT_EXIST = 1002
	ERROR_PASSWORD_ERROR  = 1003

	ERROR_USER_NOT_EXIST = 2001
)

type CodeMsg struct {
	Code    int
	Message string
}

var codeMsg = map[int]CodeMsg{
	SUCCESS:             {Code: 200, Message: "Success"},
	ERROR_INVALID_INPUT: {Code: 400, Message: "Error: Invalid input"},
	ERROR:               {Code: 500, Message: "Error: Internal server error."},

	ACCESS_TOKEN_NOT_FOUND:    {Code: 401, Message: "Error: Access token not found."},
	ACCESS_TOKEN_EXPIRED:      {Code: 401, Message: "Error: Access token expired."},
	ACCESS_TOKEN_INVALID:      {Code: 401, Message: "Error: Access token invalid."},
	ACCESS_TOKEN_FORMAT_ERROR: {Code: 400, Message: "Error: Access token format error."},

	REFRESH_TOKEN_NOT_FOUND: {Code: 401, Message: "Error: Refresh token not found."},
	REFRESH_TOKEN_EXPIRED:   {Code: 401, Message: "Error: Refresh token expired."},
	REFRESH_TOKEN_INVALID:   {Code: 401, Message: "Error: Refresh token invalid."},

	ERROR_EMAIL_EXIST:     {Code: 400, Message: "Error: Email already registered."},
	ERROR_EMAIL_NOT_EXIST: {Code: 400, Message: "Error: Email not found."},
	ERROR_PASSWORD_ERROR:  {Code: 400, Message: "Error: Incorrect password."},

	ERROR_USER_NOT_EXIST: {Code: 400, Message: "Error: User not found."},
}

func GetErrMsg(code int) CodeMsg {
	return codeMsg[code]
}
