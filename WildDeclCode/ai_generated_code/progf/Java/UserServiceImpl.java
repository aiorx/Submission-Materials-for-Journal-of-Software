// package com.complaint.backend.services.jwt;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import com.complaint.backend.repositories.UserRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class UserServiceImpl implements UserService{

//     private final UserRepository userRepository;

//    @Override
// public UserDetailsService userDetailsService() {

//             return new UserDetailsService() {

//              @Override
//                 public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//                     return userRepository.findFirstByEmail (email). orElseThrow (() -> 
//                     new UsernameNotFoundException("User not found"));
//             }
//         };
//     }
// }



// below code Aided using common development resources

package com.complaint.backend.services.jwt;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// import com.complaint.backend.entities.User;
import com.complaint.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {

            @Override
            public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
                com.complaint.backend.entities.User user = userRepository.findFirstByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                // Map the user's role to SimpleGrantedAuthority
                return new User(
                        user.getEmail(),
                        user.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority(user.getUserRole().name()))
                );
            }
        };
    }
}

