package com.brewly.brewly_backend.pos;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class OrderMessageController {

    @MessageMapping("/order-update")
    @SendTo("/topic/orders")
    public String broadcastOrderUpdate(String message) {
        return message;
    }

    @MessageMapping("/table-update")
    @SendTo("/topic/tables")
    public String broadcastTableUpdate(String message) {
        return message;
    }
}
