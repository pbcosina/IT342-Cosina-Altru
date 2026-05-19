package edu.cit.cosina.altru.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Value("${app.firebase.credentials-path:}")
    private String credentialsPath;

    @Value("${app.firebase.project-id:}")
    private String projectId;

    @Bean
    @ConditionalOnProperty(prefix = "app.firebase", name = "enabled", havingValue = "true")
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        FirebaseOptions.Builder builder = FirebaseOptions.builder();
        if (credentialsPath != null && !credentialsPath.isBlank()) {
            try (FileInputStream serviceAccount = new FileInputStream(credentialsPath.trim())) {
                builder.setCredentials(GoogleCredentials.fromStream(serviceAccount));
            }
        } else {
            builder.setCredentials(GoogleCredentials.getApplicationDefault());
        }

        if (projectId != null && !projectId.isBlank()) {
            builder.setProjectId(projectId.trim());
        }

        return FirebaseApp.initializeApp(builder.build());
    }

    @Bean
    @ConditionalOnProperty(prefix = "app.firebase", name = "enabled", havingValue = "true")
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
