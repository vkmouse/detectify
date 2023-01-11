package r2

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	cfg "detectify/config"
	"detectify/pkg/log"
)

var (
	client *s3.Client
)

func init() {
	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", cfg.R2AccountId),
		}, nil
	})

	r2Config, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(cfg.R2AccessKeyId, cfg.R2AccessKeySecret, "")),
	)
	if err != nil {
		log.Fatal(err)
	}

	client = s3.NewFromConfig(r2Config)
}

func GeneratingPresignedURL(filename string) string {
	presignClient := s3.NewPresignClient(client)

	presignResult, err := presignClient.PresignPutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(cfg.R2BucketName),
		Key:    aws.String(filename),
	})

	if err != nil {
		panic("Couldn't get presigned URL for PutObject")
	}

	return presignResult.URL
}
