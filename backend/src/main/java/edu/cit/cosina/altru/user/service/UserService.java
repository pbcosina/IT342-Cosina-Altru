package edu.cit.cosina.altru.user.service;

import edu.cit.cosina.altru.user.User;
import edu.cit.cosina.altru.user.dto.UserProfileResponse;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserProfileResponse toProfile(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        return response;
    }
}
