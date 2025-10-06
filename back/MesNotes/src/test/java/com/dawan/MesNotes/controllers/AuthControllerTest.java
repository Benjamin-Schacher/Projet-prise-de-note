package com.dawan.MesNotes.controllers;

import com.dawan.MesNotes.dto.UserDTO;
import com.dawan.MesNotes.entities.User;
import com.dawan.MesNotes.mappers.UserMapper;
import com.dawan.MesNotes.repositories.UserRepository;
import com.dawan.MesNotes.security.JwtUtils;
import com.dawan.MesNotes.security.SecurityConfig;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@SuppressWarnings("unused")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private User user1;
    private User user2;

    @MockitoBean
    private UserMapper userMapper;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private SecurityConfig securityConfig;

    @MockitoBean
    private Authentication authentication;

    @MockitoBean
    private SecurityFilterChain securityFilterChain;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private UserRepository userRepository;

    @BeforeEach
    public void setUp(){
        user1 = User.builder().username("John123").email("john@gmail.com").password("MainMain123#").build();
        user2 = User.builder().username("Paul123").email("paul@gmail.com").password("MainMain123#").build();
        List<User> lstUser = new ArrayList<>();
        lstUser.add(user1);
        lstUser.add(user2);
    }

    @Test
    public void showRegister_GoodTest() throws Exception {
        String userJson = """
    {
        "username":"John123",
        "email":"john@gmail.com",
        "password":"MainMain123#"
    }
    """;

        when(userRepository.findByUsername("John123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("john@gmail.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("MainMain123#")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDTO userDTO = new UserDTO("John123", "john@gmail.com");
        when(userMapper.userToUserDTO(any(User.class))).thenReturn(userDTO);

        MockHttpServletResponse response = mockMvc.perform(
                        post("/auth/inscription")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(userJson)
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse();

        System.out.println("Réponse JSON : " + response.getContentAsString());

    }

    @Test
    public void showRegister_usernameExistTest() throws Exception {
        String userJson = """
    {
        "username":"John123",
        "email":"john@gmail.com",
        "password":"MainMain123#"
    }
    """;

        when(userRepository.findByUsername("John123")).thenReturn(Optional.of(user1));

        MockHttpServletResponse response = mockMvc.perform(
                        post("/auth/inscription")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(userJson)
                )
                .andExpect(status().isBadRequest()) // ou isConflict() si ton controller retourne 409
                .andReturn()
                .getResponse();

        System.out.println("Réponse JSON : " + response.getContentAsString());
    }

    @Test
    public void showRegister_EmailExistTest() throws Exception {
        String userJson = """
    {
        "username":"John123",
        "email":"john@gmail.com",
        "password":"MainMain123#"
    }
    """;

        when(userRepository.findByEmail("john@gmail.com")).thenReturn(Optional.of(user1));

        MockHttpServletResponse response = mockMvc.perform(
                        post("/auth/inscription")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(userJson)
                )
                .andExpect(status().isBadRequest()) // ou isConflict() si ton controller retourne 409
                .andReturn()
                .getResponse();

        System.out.println("Réponse JSON : " + response.getContentAsString());
    }

    @Test
    public void showRegister_PasswordInvalideTest() throws Exception {
        String userJson = """
    {
        "username":"John123",
        "email":"john@gmail.com",
        "password":"short1#"
    }
    """;

        MockHttpServletResponse response = mockMvc.perform(
                        post("/auth/inscription")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(userJson)
                )
                .andReturn()
                .getResponse();

        assertEquals(400, response.getStatus()); // on s'attend à 400
        System.out.println("Réponse JSON : " + response.getContentAsString());
    }

    @Test
    public void showRegister_EmailInvalideTest() throws Exception{
        String userJson = """
    {
        "username":"John123",
        "email":"johngmail.com",
        "password":"MainMain123#"
    }
    """;
        MockHttpServletResponse response = mockMvc.perform(
                post("/auth/inscription")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andReturn()
                .getResponse();
        assertEquals(400, response.getStatus());
        System.out.println("Réponse JSON : " + response.getContentAsString());
    }

    @Test
    public void showLogin_GOodTest() throws Exception {
        String userJson = """
    {
        "email":"paul@gmail.com",
        "password":"MainMain123#"
    }
    """;

        when(userRepository.findByEmail("paul@gmail.com")).thenReturn(Optional.of(user2));
        when(passwordEncoder.matches("MainMain123#", "MainMain123#")).thenReturn(true);

        UserDTO userDTO = new UserDTO("Paul123", "paul@gmail.com");
        when(userMapper.userToUserDTO(any(User.class))).thenReturn(userDTO);

        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn(user2);
        when(authenticationManager.authenticate(any())).thenReturn(auth);

        when(jwtUtils.createToken(user2)).thenReturn("FAKE_JWT_TOKEN");

        MockHttpServletResponse response = mockMvc.perform(
                post("/auth/connexion")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson)
        ).andReturn().getResponse();

        System.out.println("=== LOGIN RESPONSE ===");
        System.out.println("HTTP STATUS : " + response.getStatus());
        System.out.println("BODY        : " + response.getContentAsString());

        JSONObject json = new JSONObject(response.getContentAsString());
        String token = json.getString("token");
        System.out.println("TOKEN = " + token);
    }
}
