package org.example.puffcode.R2Config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties({CloudflareProperties.class})

public class CloudflareConfig {
    private final CloudflareProperties cloudflareProperties;


    @Bean
    public S3Client s3Client (){
        S3Configuration  serviceConfig = S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .chunkedEncodingEnabled(false)
                .build();
        return s3Client().builder()
                .httpClientBuilder(ApacheHttpClient.builder())
                .region(Region.of("auto"))
                .endpointOverride(URI.create(cloudflareProperties.getEndpoint()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(
                                cloudflareProperties.getAccessKey()
                                , cloudflareProperties.getSecretKey()
                        )

                ))
                .serviceConfiguration(serviceConfig)
                .build();

    }
}
