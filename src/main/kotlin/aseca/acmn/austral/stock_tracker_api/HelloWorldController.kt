package aseca.acmn.austral.stock_tracker_api

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloWorldController {
    @GetMapping("/test/helloworld")
    fun helloWorld(): String {
        return "hello world"
    }
}
