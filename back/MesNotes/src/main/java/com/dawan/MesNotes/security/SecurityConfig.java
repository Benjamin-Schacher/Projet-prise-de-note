package com.dawan.MesNotes.security;

import com.dawan.MesNotes.security.error401.JwtAuthenticationEntryPoint;
import com.dawan.MesNotes.security.error403.JwtAccessDeniedHandler;
import com.dawan.MesNotes.security.filter.JwtRequestFilter;
import com.dawan.MesNotes.services.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAccessDeniedHandler accessDeniedHandler;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;
    // JwtRequestFilter is now created as a @Bean to avoid circular dependency

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public JwtRequestFilter jwtRequestFilter() {
        return new JwtRequestFilter(jwtUtils, userDetailsService);
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        return http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth ->
                            auth.requestMatchers(HttpMethod.GET, "/note/mesNotes",
                                                                "/event/**",
                                                                "/user").authenticated()
                                    .anyRequest().permitAll()
                    )
                    // accessDeniedHandler → quand un utilisateur connecté tente d’accéder à une ressource pour laquelle il n’a pas le droit.
                    .exceptionHandling(e -> e.accessDeniedHandler(accessDeniedHandler)
                            // authenticationEntryPoint → quand un utilisateur non connecté tente d’accéder à une ressource sécurisée.
                            .authenticationEntryPoint(authenticationEntryPoint))
                    // Configure la gestion de session.
                    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    // Add JWT filter before the Spring Security filter that handles form authentication
                    .addFilterBefore(jwtRequestFilter(), UsernamePasswordAuthenticationFilter.class)
                    .build();
    }
}
