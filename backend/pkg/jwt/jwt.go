package jwt

import (
	"detectify/config"
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

func GetToken(userID string, expireDuration time.Duration) (string, error) {
	claims := jwt.StandardClaims{
		ExpiresAt: time.Now().Add(expireDuration).Unix(),
		Issuer:    config.JwtIssuer,
		Id:        uuid.NewString(),
		Subject:   userID,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.JwtSecretKey)
}

func ParseToken(tokenString string) (*jwt.StandardClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, func(token *jwt.Token) (i interface{}, err error) {
		return config.JwtSecretKey, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}
