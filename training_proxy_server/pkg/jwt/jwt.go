package jwt

import (
	"errors"
	"log"
	"training-proxy-server/config"

	"github.com/golang-jwt/jwt/v4"
)

func ParseToken(tokenString string) (*jwt.StandardClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (i interface{}, err error) {
		return config.JwtSecretKey, nil
	})
	if err != nil {
		log.Println("err!=nil", err)
		return nil, err
	}
	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		return claims, nil
	}
	log.Println("invalid token")
	return nil, errors.New("invalid token")
}
