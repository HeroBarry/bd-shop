package com.bigdatan.framework.swagger;

import com.bigdatan.framework.swagger.configuration.SwaggerConfiguration;
import org.springframework.context.annotation.Import;
import springfox.documentation.swagger2.configuration.Swagger2DocumentationConfiguration;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Documented
@Inherited
@Import({Swagger2DocumentationConfiguration.class, SwaggerConfiguration.class})
public @interface EnableSBCSwagger {
}
