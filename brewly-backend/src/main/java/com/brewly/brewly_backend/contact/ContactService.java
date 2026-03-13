package com.brewly.brewly_backend.contact;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${contact.recipient.email}")
    private String recipientEmail;

    public void sendContactMessage(ContactMessage contactMessage) {
        // Send to owner
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("New Contact Form Submission: " + contactMessage.getSubject());
        message.setText(
            "Name: " + contactMessage.getName() + "\n" +
            "Email: " + contactMessage.getEmail() + "\n" +
            "Message: " + contactMessage.getMessage()
        );
        mailSender.send(message);

        // Auto-reply to user
        SimpleMailMessage autoReply = new SimpleMailMessage();
        autoReply.setTo(contactMessage.getEmail());
        autoReply.setSubject("Thank you for contacting Brewly!");
        autoReply.setText("Hi " + contactMessage.getName() + ",\n\n" +
            "Thank you for reaching out. We have received your message and will get back to you soon.\n\n" +
            "Best regards,\nBrewly Team");
        mailSender.send(autoReply);
    }
}
