package r2

import (
	"context"
	"fmt"
	"path"
	"strings"

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

func ListBucketItems() (map[string]int, error) {
	bucket := cfg.R2BucketName
	results := make(map[string]int)

	resp, err := client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{Bucket: aws.String(bucket)})
	if err != nil {
		return results, err
	}

	for _, item := range resp.Contents {
		size := int(item.Size)
		if size > 0 {
			results[*item.Key] = size
		}
	}
	return results, nil
}

func getFileNameWithoutExtension(fileNameWithExt string) string {
	return strings.TrimSuffix(path.Base(fileNameWithExt), path.Ext(fileNameWithExt))
}
