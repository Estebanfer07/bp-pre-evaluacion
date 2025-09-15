package com.esterodr.configuration;

import static lombok.AccessLevel.PUBLIC;

import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.unit.DataSize;

@Data
@ConfigurationProperties(prefix = "retail")
@FieldDefaults(level = PUBLIC)
public class ApplicationPropertiesConfiguration {

    String basePath;
    DataSize maxInMemorySize;
    Integer connectTimeout;
    Integer readTimeout;

    RedisConfiguration redis;

    Service services;

    @Data
    @FieldDefaults(level = PUBLIC)
    public static class RedisConfiguration {
        Integer timeExpiration;
        String prefix;
    }

    @Data
    @FieldDefaults(level = PUBLIC)
    public static class Service {
        SearchAccounts searchAccounts;
        CustomerProducts customerProducts;
    }

    @Data
    @FieldDefaults(level = PUBLIC)
    public static class SearchAccounts {

        String authUser;
        String authPassword;
        String defaultCompany;
        String defaultDevice;
        String defaultChannel;
        String defaultIp;
        String defaultGeolocation;
        String defaultAgency;
        String defaultMeans;
        String defaultLanguage;
        String defaultUser;
        String defaultApp;
        String defaultTransactionType;
        String defaultFiller;
        String saBasePath;
        String saPath;

    }

    @Data
    @FieldDefaults(level = PUBLIC)
    public static class CustomerProducts {
        String aliasPath;
    }
}
