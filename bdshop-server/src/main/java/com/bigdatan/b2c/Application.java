package com.bigdatan.b2c;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
//import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 应用启动器
 *
 * @since 1.0.0.RELEASE
 */
//@EnableCaching
//@EnableScheduling
@SpringBootApplication
@MapperScan(basePackages = "com.bigdatan.b2c.mapper")
//@EnableConfigurationProperties(value = AliyunOssProperties.class)
public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);
    }
}
