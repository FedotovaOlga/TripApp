package com.trip_app_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.RouterFunctions;
import org.springframework.web.servlet.function.ServerResponse;

@SpringBootApplication
public class TripAppBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TripAppBackendApplication.class, args);
	}

	@Bean
	RouterFunction<ServerResponse> staticResourceLocator(Environment env) {
		return RouterFunctions.resources("/files/**", new FileSystemResource(env.getProperty("tripapp.filepath")));
	}

}