package errmsg

const (
	SUCCESS             = 200
	ACCEPTED            = 202
	ERROR_INVALID_INPUT = 400
	ERROR_FORBIDDEN     = 403
	ERROR               = 500

	ACCESS_TOKEN_NOT_FOUND    = 600
	ACCESS_TOKEN_EXPIRED      = 601
	ACCESS_TOKEN_INVALID      = 602
	ACCESS_TOKEN_FORMAT_ERROR = 603

	ERROR_SERVER_NOT_STARTED       = 1001
	ERROR_SERVER_SPACE_NOT_CREATED = 1002

	ERROR_TRAINING_IN_PROGRESS   = 2001
	ERROR_TRAINING_NOT_COMPLETED = 2002
)

type CodeMsg struct {
	Code    int
	Message string
}

var codeMsg = map[int]CodeMsg{
	SUCCESS:             {Code: 200, Message: "Success"},
	ACCEPTED:            {Code: 202, Message: "Accepted"},
	ERROR_INVALID_INPUT: {Code: 400, Message: "Error: Invalid input"},
	ERROR_FORBIDDEN:     {Code: 403, Message: "Error: Forbidden"},
	ERROR:               {Code: 500, Message: "Error: Internal server error."},

	ACCESS_TOKEN_NOT_FOUND:    {Code: 401, Message: "Error: Access token not found."},
	ACCESS_TOKEN_EXPIRED:      {Code: 401, Message: "Error: Access token expired."},
	ACCESS_TOKEN_INVALID:      {Code: 401, Message: "Error: Access token invalid."},
	ACCESS_TOKEN_FORMAT_ERROR: {Code: 400, Message: "Error: Access token format error."},

	ERROR_SERVER_NOT_STARTED:       {Code: 400, Message: "Error: Server is not started."},
	ERROR_SERVER_SPACE_NOT_CREATED: {Code: 400, Message: "Error: Server space is not created."},

	ERROR_TRAINING_IN_PROGRESS:   {Code: 400, Message: "Error: Training already in progress."},
	ERROR_TRAINING_NOT_COMPLETED: {Code: 409, Message: "Error: Training is not completed yet."},
}

func GetErrMsg(code int) CodeMsg {
	return codeMsg[code]
}
