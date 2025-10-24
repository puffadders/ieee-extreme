package org.example.puffcode.R2Config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "cloudflare.r2")
public class CloudflareProperties {
    private String accessKey;
    private String secretKey;
    private String bucketName;
    private String endpoint;
}
