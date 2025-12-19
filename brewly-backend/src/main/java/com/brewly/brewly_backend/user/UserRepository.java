<<<<<<< HEAD
<<<<<<< HEAD
package com.brewly.brewly_backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
=======
=======
>>>>>>> e55e188 (Add frontend and backend project structure)
package com.brewly.brewly_backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
<<<<<<< HEAD
>>>>>>> 564c4ca (Initial commit: frontend and backend setup)
=======
>>>>>>> e55e188 (Add frontend and backend project structure)
}