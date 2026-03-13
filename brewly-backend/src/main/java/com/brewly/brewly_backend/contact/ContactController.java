package com.brewly.brewly_backend.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {
    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<String> sendContact(@RequestBody ContactMessage contactMessage) {
        contactService.sendContactMessage(contactMessage);
        return new ResponseEntity<>("Message sent successfully!", HttpStatus.OK);
    }
}
